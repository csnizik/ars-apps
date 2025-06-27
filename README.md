# ARS Apps

A Drupal site for Agricultural Research Services (ARS).

## CI/CD

### Tugboat Preview Environments

This project is configured with **Tugboat** for automated preview environments. Tugboat creates a live, working preview of every pull request with a unique URL, allowing for comprehensive testing of changes before they're merged.

#### Configuration Files

- **`.tugboat/config.yml`** - Main Tugboat configuration defining services and build process
- **`.tugboat/settings.local.php`** - Drupal-specific settings for Tugboat environments

#### Service Architecture

Our Tugboat setup uses two services:

1. **Database Service** (`tugboatqa/mariadb:10.11`)
   - MariaDB 10.11 optimized for Drupal 11 performance
   - Configured with increased packet size for large database operations
   - Handles database imports and storage

2. **Web Service** (`tugboatqa/php:8.3-apache`)
   - PHP 8.3 with Apache (Drupal 11 requirement)
   - Serves the Drupal application
   - Handles Composer dependencies, file permissions, and site building

#### Build Process

Tugboat builds previews in three stages:

**Init Stage:**

- Configures web server (opcache, mod-rewrite)
- Links document root to `/web` directory
- Sets up database packet size limits

**Update Stage:**

- Installs Composer dependencies
- Installs Stage File Proxy module for file handling
- Copies Tugboat-specific Drupal settings
- Sets up file directory permissions

**Build Stage:**

- Rebuilds Drupal caches
- Imports configuration from `/config/sync`
- Runs database updates
- Configures Stage File Proxy for external file access

#### Drupal 11 Optimizations

Our configuration includes specific optimizations for Drupal 11:

- **PHP 8.3**: Required minimum version for Drupal 11
- **MariaDB 10.11**: Enhanced performance and compatibility
- **Config Sync**: Properly configured for Drupal 11's configuration management
- **Modern Extensions**: Updated PHP extensions and Apache modules

#### Docker Image Strategy

Our Tugboat configuration uses **Tugboat's prebuilt Docker images** for optimal performance:

**Image Versioning Approach:**
- **`tugboatqa/mariadb:10.11`** - Point-release versioning prevents breaking changes
- **`tugboatqa/php:8.3-apache`** - Major version tag ensures PHP 8.3.x compatibility

**Why Tugboat Images:**
- **Optimized**: Pre-configured with tools for Tugboat's build process
- **Reliable**: Extends official Docker images with Tugboat-specific enhancements
- **Maintained**: Automatically tracks upstream image updates
- **Tested**: Proven compatibility with Tugboat's snapshot and caching system

**Version Tag Benefits:**
- **Stability**: Specific versions prevent unexpected breaking changes
- **Drupal 11 Compliance**: Images selected for Drupal 11 requirements
- **Performance**: No additional third-party images needed for standard Drupal setup

#### Features

- **Automatic Previews**: Every pull request gets a unique preview URL
- **Database Import**: Supports importing production databases via SCP
- **File Management**: Stage File Proxy handles external file assets
- **Performance Optimized**: Composer optimization and caching strategies
- **Drupal Standards**: Follows Drupal 11 best practices and requirements

#### .gov Compliance & Security

**Accessibility Testing:**
- **Lighthouse Audits**: Automated WCAG 2.1 AA compliance testing on every preview
- **Key Pages Tested**: Homepage, login, contact, search pages for accessibility
- **PR Integration**: Accessibility status shown directly on pull requests
- **Government Standards**: Meets federal accessibility requirements

**Security Features:**
- **Environment Isolation**: Each preview runs in isolated containers
- **Secure Hash Generation**: Unique hash salts generated per preview environment
- **No Production Data**: Previews use sanitized data, never production secrets
- **Access Controls**: Admin-only user registration in preview environments
- **Error Handling**: Error messages hidden from users in previews

**Preview Security Settings:**
- Database access isolated to preview containers only
- Update access disabled for security
- File permissions properly configured
- No external network access to production systems

#### Workflow Features

**Automated Preview Management:**
- **Auto-Generate Previews**: Every pull request automatically creates a live preview
- **Auto-Update Previews**: PR updates trigger preview refreshes with latest code
- **Auto-Delete Previews**: Previews automatically cleanup when PRs are merged/closed
- **Pull Request Merging**: Previews test the merged state for integration validation

**Base Preview Optimization:**
- **Repository Base Preview**: Main branch serves as foundation for all PR previews
- **Faster Builds**: New previews build in ~30 seconds vs 5+ minutes (skips init/update phases)
- **Cost Efficiency**: Previews store only differences (100-200MB vs 2-3GB full builds)
- **Shared Assets**: Database, files, and dependencies cached in base preview

**Preview Management Options:**
- **Refresh**: Update preview with latest code changes (recommended for most updates)
- **Rebuild**: Full rebuild including Docker images and configuration changes
- **Clone**: Create duplicate previews for simultaneous QA and product testing
- **Terminal Access**: Direct SSH-like access to preview containers for debugging

#### Usage

1. **Setup Base Preview**: Build main branch preview and set as Repository Base Preview
2. **Create Pull Request**: Tugboat automatically builds optimized preview from base
3. **Access Preview**: Use unique URL provided in GitHub PR or Tugboat dashboard
4. **Test Changes**: Full Drupal 11 environment with your code integrated
5. **Iterate**: Updates to PR trigger automatic preview refreshes
6. **Cleanup**: Previews automatically delete when PR is merged or closed

#### Environment Variables

The configuration uses Tugboat's built-in environment variables:

- `TUGBOAT_ROOT`: Git repository root path
- `TUGBOAT_REPO_ID`: Used for generating secure hash salts
- `DOCROOT`: Web server document root location

For additional custom environment variables (API keys, etc.), configure them in the Tugboat Repository Settings.
