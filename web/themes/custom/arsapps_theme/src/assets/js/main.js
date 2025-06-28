// Import Alpine.js and plugins
import Alpine from 'alpinejs';
import anchor from '@alpinejs/anchor';
import focus from '@alpinejs/focus';
import mask from '@alpinejs/mask';

// Register Alpine plugins
Alpine.plugin(anchor);
Alpine.plugin(focus);
Alpine.plugin(mask);

// Start Alpine
window.Alpine = Alpine;
Alpine.start();

// Drupal behaviors compatibility
(function (Drupal, once) {
  'use strict';

  /**
   * ARS Apps Theme Alpine.js integration.
   */
  Drupal.behaviors.arsappsAlpine = {
    attach: function (context, settings) {
      // Re-initialize Alpine for any new DOM content
      once('alpine-init', '[x-data]', context).forEach(function (element) {
        Alpine.initTree(element);
      });
    }
  };

})(Drupal, once);