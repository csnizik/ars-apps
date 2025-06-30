import { defineConfig, loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import liveReload from 'vite-plugin-live-reload';
import twig from 'vite-plugin-twig-drupal';
import path from 'path';
import fs from 'fs';
import { join } from 'node:path';

// Optional HTTPS config for local dev with mkcert
function getHttpsConfig() {
  const keyPath = path.resolve(
    __dirname,
    'plugins/https_key/localhost-key.pem'
  );
  const certPath = path.resolve(__dirname, 'plugins/https_key/localhost.pem');

  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    return {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };
  }

  return false;
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, '../../../..'), '');
  console.log('env is ', env);

  return {
    plugins: [
      tailwindcss(),
      liveReload(__dirname + '/**/*.(php|inc|includes|twig)'),
      twig({
        namespaces: {
          components: join(__dirname, 'src/components'),
        },
        functions: {
          reverse: (twigInstance) =>
            twigInstance.extendFunction(
              'reverse',
              () => (text) => text.split(' ').reverse().join(' ')
            ),
          clean_unique_id: (twigInstance) =>
            twigInstance.extendFilter(
              'clean_unique_id',
              () => (text) => text.split(' ').reverse().join(' ')
            ),
        },
        globalContext: {
          active_theme: 'arsapps_theme',
          is_front_page: false,
        },
      }),
    ],

    publicDir: 'src',

    build: {
      assetsInlineLimit: 0,
      emptyOutDir: false,
      manifest: false,
      outDir: 'dist',
      rollupOptions: {
        input: {
          tailwind: path.resolve(__dirname, 'src/css/tailwind.css'),
          theme: path.resolve(__dirname, 'src/js/theme.js'),
        },
        output: {
          assetFileNames: ({ name }) => {
            if (/\.(css)$/.test(name ?? '')) return 'css/[name][extname]';
            if (/\.(js)$/.test(name ?? '')) return 'js/[name][extname]';
            if (/\.(png|jpe?g|gif|svg)$/.test(name ?? ''))
              return 'images/[name][extname]';
            if (/\.(woff2?|ttf|eot)$/.test(name ?? ''))
              return 'fonts/[name][extname]';
            return '[name][extname]';
          },
          sourcemap: mode === 'development',
        },
      },
    },

    server: {
      host: '0.0.0.0',
      https: getHttpsConfig(),
      origin: 'https://arsapps.ddev.site',
      cors: {
        origin: ['https://arsapps.ddev.site'],
      },
      strictPort: false,
      port: 3009,
      hmr: {
        host: 'arsapps.ddev.site',
        protocol: 'wss',
        port: 3009,
      },
    },
  };
});
