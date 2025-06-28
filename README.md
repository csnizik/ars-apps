# ARS Apps

## CI/CD

This project uses GitHub Actions for continuous integration and deployment with a differential testing strategy:

### Test Strategy

**On Pull Requests (all branches):**

- Static analysis (PHPCS & PHPStan)
- Unit tests only (fast, no database)
- Accessibility testing with pa11y
- Filesystem security scanning with Trivy

**On Merge to develop/main:**

- All PR tests plus:
- Full PHPUnit test suite (with database)
- Docker image security scanning

### Workflow Jobs

1. **Code Quality (PHPCS & PHPStan)** - Enforces Drupal coding standards and static analysis
2. **PHPUnit Unit Tests** - Fast unit tests without database dependencies
3. **Filesystem Security Scan** - Trivy vulnerability scanning of source code
4. **Accessibility Tests** - pa11y testing against WCAG2AA standards
5. **PHPUnit Full Tests** *(merge only)* - Complete test suite with database
6. **Docker Image Security Scan** *(merge only)* - Trivy scanning of built Docker image

### Security Scanning

- **Filesystem scans** run on every PR for quick feedback
- **Image scans** run only on merges to avoid resource overhead
- Results are uploaded to GitHub Security tab for tracking
- Scans detect CRITICAL, HIGH, and MEDIUM severity vulnerabilities

### Docker Integration

The project includes a production-ready multi-stage Docker build with:

- PHP 8.3 with FPM and Alpine Linux
- Nginx web server with Drupal-specific configuration
- Security hardening and health checks
- Optimized for container orchestration platforms

See [README-DOCKER.md](README-DOCKER.md) for detailed Docker deployment information.
