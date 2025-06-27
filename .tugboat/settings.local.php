<?php
$databases['default']['default'] = array (
  'database' => 'tugboat',
  'username' => 'tugboat',
  'password' => 'tugboat',
  'prefix' => '',
  'host' => 'database',
  'port' => '3306',
  'namespace' => 'Drupal\\Core\\Database\\Driver\\mysql',
  'driver' => 'mysql',
);

// Use the TUGBOAT_REPO_ID to generate a hash salt for Tugboat sites.
$settings['hash_salt'] = hash('sha256', getenv('TUGBOAT_REPO_ID'));

// If your Drupal config directory is outside of the Drupal web root, it's
// recommended to uncomment and adapt the following. Note: the TUGBOAT_ROOT
// environment variable is equivalent to the git repo root.
$settings['config_sync_directory'] = getenv('TUGBOAT_ROOT') . '/config/sync';

// If you are using private files, and that directory is outside of the Drupal
// web root, it's recommended to uncomment and adapt the following. Note: the
// TUGBOAT_ROOT environment variable is equivalent to the git repo root.
# $settings['file_private_path'] = getenv('TUGBOAT_ROOT') . '/files-private';

// Prevent Drupal from making the sites/default directory unwritable.
$settings['skip_permissions_hardening'] = TRUE;

// Security settings for .gov compliance in preview environments
$settings['update_free_access'] = FALSE;
$settings['allow_authorize_operations'] = FALSE;

// Disable user registration for security (preview environments only)
$config['user.settings']['register'] = 'admin_only';

// Enable error logging but hide errors from users
$config['system.logging']['error_level'] = 'hide';