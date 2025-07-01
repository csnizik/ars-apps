const tailwindcss = require('@tailwindcss/postcss');
const autoprefixer = require('autoprefixer');

/** @type {import('postcss').AcceptedPlugin[]} */
module.exports = {
  plugins: [tailwindcss(), autoprefixer()],
};
