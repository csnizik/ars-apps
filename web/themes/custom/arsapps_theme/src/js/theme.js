;(function ($, Drupal, drupalSettings) {
  ('use strict');

  Drupal.Theme = {};
  // Force Tailwind to include these during purge
  document.body.classList.add(
    'text-blue-600',
    'font-source-sans',
    'bg-yellow-100'
  );

  /**
   * Constructor
   */
  let ThemeLibraries = function () {
    this.selectors = {
      main: '#main',
    };

    this.elements = {
      htmlBody: $('html, body'),
      body: $('body'),
      page: $('#page'),
    };

    console.info('Theme Libraries loaded');
    return this;
  };

  /**
   * Methods
   */
  ThemeLibraries.prototype = {};

  /**
   * Load Themes
   * @type {{attach: attach, detach: detach}}
   */
  Drupal.behaviors.theme = {
    attach: function (context) {
      if (context.body !== undefined) {
        Drupal.Theme.Common = new ThemeLibraries();
      }
    },
  };
})(window.jQuery, Drupal, drupalSettings)
