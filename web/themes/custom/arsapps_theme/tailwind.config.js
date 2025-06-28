/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js}',
    './templates/**/*.twig',
    './js/**/*.js',
    '../../../modules/custom/**/*.{php,twig}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Source Sans 3 Variable', 'Public Sans Variable', 'system-ui', 'sans-serif'],
        'serif': ['Merriweather', 'Georgia', 'serif'],
        'mono': ['Roboto Mono Variable', 'Consolas', 'monospace'],
      },
      colors: {
        // USWDS Color System
        'uswds': {
          'base': {
            'lightest': '#f9f9f9',
            'lighter': '#dfe1e2',
            'light': '#a9aeb1',
            DEFAULT: '#71767a',
            'dark': '#565c65',
            'darker': '#3d4551',
            'darkest': '#1b1b1b',
          },
          'primary': {
            'lighter': '#d9e8f6',
            'light': '#73b3e7',
            DEFAULT: '#005ea2',
            'vivid': '#0050d8',
            'dark': '#1a4480',
            'darker': '#162e51',
          }
        }
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries'),
    require('tailwindcss-animate'),
    require('@iconify/tailwind').addIconSelectors(['fa6-brands', 'material-symbols']),
  ],
}