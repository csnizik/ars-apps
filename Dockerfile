# syntax=docker/dockerfile:1
# Multi-stage Drupal production build following 2025 best practices

# ========================================
# Composer stage for dependency management
# ========================================
FROM composer:lts AS composer

# Install system packages needed to compile extensions
RUN apt-get update && \
    apt-get install -y libpng-dev libjpeg-dev libfreetype6-dev && \
    docker-php-ext-configure gd --with-freetype --with-jpeg && \
    docker-php-ext-install gd && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy composer files first for better layer caching
COPY composer.json composer.lock ./

# Install production dependencies only
RUN --mount=type=cache,target=/tmp/cache \
    composer install \
    --no-dev \
    --optimize-autoloader \
    --no-interaction \
    --no-progress \
    --prefer-dist \
    --no-scripts

# Copy source code and run post-install scripts
COPY . .
RUN composer run-script post-install-cmd --no-dev

# ========================================
# Node.js stage for frontend assets
# ========================================
FROM node:20-alpine AS frontend

WORKDIR /app

# Copy theme directory structure
COPY web/themes/custom/ ./web/themes/custom/

# Install and build frontend assets if package.json exists
RUN if [ -f "./web/themes/custom/arsapps_theme/package.json" ]; then \
      cd web/themes/custom/arsapps_theme && \
      npm ci --only=production && \
      npm run build || true; \
    fi


# ========================================
# Production runtime stage
# ========================================
FROM php:8.3-fpm-alpine AS production

# Install system dependencies and PHP extensions
RUN apk add --no-cache \
        nginx \
        supervisor \
        bash \
        curl \
        git \
        mariadb-client \
        zip \
        unzip \
        libpng-dev \
        libjpeg-turbo-dev \
        libwebp-dev \
        freetype-dev \
        libzip-dev \
        icu-dev \
        oniguruma-dev \
    && docker-php-ext-configure gd \
        --with-freetype \
        --with-jpeg \
        --with-webp \
    && docker-php-ext-install -j$(nproc) \
        gd \
        intl \
        mbstring \
        opcache \
        pdo_mysql \
        zip \
    && rm -rf /var/cache/apk/*

# Configure PHP for production
COPY <<EOF /usr/local/etc/php/conf.d/drupal.ini
; Production PHP configuration for Drupal
memory_limit = 256M
max_execution_time = 300
upload_max_filesize = 32M
post_max_size = 32M
max_input_vars = 3000

; OPcache configuration
opcache.enable = 1
opcache.memory_consumption = 128
opcache.max_accelerated_files = 4000
opcache.revalidate_freq = 2
opcache.fast_shutdown = 1
opcache.enable_cli = 1

; Security settings
expose_php = Off
allow_url_fopen = Off
allow_url_include = Off
EOF

# Configure Nginx
COPY <<EOF /etc/nginx/http.d/default.conf
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/html/web;
    index index.php index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Drupal specific configuration
    location = /favicon.ico {
        log_not_found off;
        access_log off;
    }

    location = /robots.txt {
        allow all;
        log_not_found off;
        access_log off;
    }

    # Block access to hidden files and directories
    location ~ /\. {
        deny all;
    }

    # Block access to sensitive files
    location ~ ^/sites/.*/private/ {
        deny all;
    }

    # Block access to vendor directory
    location ^~ /vendor/ {
        deny all;
    }

    # Handle PHP files
    location ~ \.php$ {
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_read_timeout 300;
    }

    # Clean URLs for Drupal
    location / {
        try_files $uri /index.php?$query_string;
    }

    # Handle image styles for Drupal
    location ~ ^/sites/.*/files/styles/ {
        try_files $uri /index.php?$query_string;
    }

    # Deny access to any files with a .php extension in the uploads directory
    location ~* /(?:uploads|files)/.*\.php$ {
        deny all;
    }
}
EOF

# Configure Supervisor
COPY <<EOF /etc/supervisor/conf.d/supervisord.conf
[supervisord]
nodaemon=true
user=root
logfile=/var/log/supervisor/supervisord.log
pidfile=/var/run/supervisord.pid

[program:php-fpm]
command=php-fpm
autostart=true
autorestart=true
stderr_logfile=/var/log/php-fpm.err.log
stdout_logfile=/var/log/php-fpm.out.log

[program:nginx]
command=nginx -g 'daemon off;'
autostart=true
autorestart=true
stderr_logfile=/var/log/nginx.err.log
stdout_logfile=/var/log/nginx.out.log
EOF

# Create application user for security
RUN addgroup -g 1001 drupal && \
    adduser -D -u 1001 -G drupal drupal

# Set up directory structure
WORKDIR /var/www/html

# Copy application files from composer stage
COPY --from=composer --chown=drupal:drupal /app .

# Copy built frontend assets if they exist
COPY --from=frontend --chown=drupal:drupal /app/web/themes/custom/ ./web/themes/custom/

# Set proper permissions
RUN mkdir -p web/sites/default/files \
    && chown -R drupal:drupal web/sites/default/files \
    && chmod -R 775 web/sites/default/files \
    && chown -R drupal:drupal /var/www/html \
    && mkdir -p /var/log/supervisor \
    && chown -R drupal:drupal /var/log/supervisor

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/user/login || exit 1

# Switch to non-root user
USER drupal

# Expose port
EXPOSE 80

# Start supervisor
CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
