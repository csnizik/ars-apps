# ARSApps Theme

A custom Drupal 11 theme using [Tailwind CSS v4](https://tailwindcss.com/)

## Local Development

This theme uses Vite for its frontend build system. To enable live reload, Tailwind builds, and Twig component loading in development:

```bash
npm install
npm run dev
```

* Requires Node.js v20+.

### HTTPS for Local Dev (optional but recommended)

To avoid mixed content issues when developing with Vite and Drupal served over HTTPS (as with DDEV), this theme supports SSL certificates for Vite's dev server.

#### 1. Generate certificates

Inside the theme directory, run:

```bash
mkdir -p plugins/https_key
mkcert localhost
```

This will generate:

* **localhost.pem** - the public certificate
* **localhost-key.pem** - the private key

#### 2. Confirm `.env` variables

Your project root (not theme root) should have a `.env` file with:

```env
VITE_SERVER_HOST=localhost
VITE_SERVER_PORT=3009
VITE_SERVER_ORIGIN=https://localhost:3009
```

### Building the Theme

To generate production assets:

```bash
npm run build
```

Assets will be written to `/dist` and loaded via Drupal libraries.

### Twig Component Rendering

This theme uses `vite-plugin-twig-drupal` to support Storybook-ready Twig components. Components should be placed in:

```bash
/src/components/
```

They will be compiled and available for import in JS and Storybook stories.

### TODO

1. Add Storybook integration
2. Migrage legacy jQuery
3. Finalize theme regions and templates
