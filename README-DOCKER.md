# Docker Deployment Guide

This project includes a production-ready Docker setup following best practices for Drupal 11 applications.

## Features

- **Multi-stage build** for optimized production images
- **PHP 8.3** with FPM and production optimizations
- **Alpine Linux** base for minimal attack surface
- **Nginx** web server with Drupal-specific configuration
- **Security hardening** with non-root user execution
- **Health checks** for container orchestration
- **Build caching** for faster CI/CD pipelines

## Architecture

The Dockerfile uses a 3-stage build process:

1. **Composer stage**: Installs PHP dependencies
2. **Frontend stage**: Builds frontend assets (if present)
3. **Production stage**: Creates the final runtime image

## CI/CD Integration

The Docker setup is ready for integration into CI/CD workflows and includes:

- **Multi-stage optimization** for production builds
- **Security hardening** with minimal attack surface
- **Health checks** for container orchestration
- **Build caching** for faster deployments

## Local Development

To build and run locally:

```bash
# Build the image
docker build -t arsapps:local .

# Run the container
docker run -p 8080:80 arsapps:local
```

## Production Deployment

The Docker image is ready for deployment to any container orchestration platform including:

- Kubernetes clusters
- Docker Swarm
- Azure Container Instances
- AWS ECS/Fargate

## Security Features

- Non-root user execution
- Minimal Alpine base image
- Security headers in Nginx configuration
- Production-hardened PHP configuration
- Restricted file permissions

## Health Monitoring

The container includes a health check endpoint at `/user/login` that can be used by orchestration platforms for:

- Container readiness detection
- Automatic restart on failure
- Load balancer health checks
