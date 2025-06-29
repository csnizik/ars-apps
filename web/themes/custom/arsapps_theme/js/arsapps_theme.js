/**
 * @file
 * ARS Apps Theme JavaScript behaviors.
 */

(function (Drupal, once) {
  'use strict';

  /**
   * Theme initialization behavior.
   */
  Drupal.behaviors.arsappsTheme = {
    attach: function (context, settings) {
      // Initialize theme-specific JavaScript here.
      once('arsapps-theme-init', 'html', context).forEach(function (element) {
        // Add theme functionality here.
      });
    }
  };

})(Drupal, once);
