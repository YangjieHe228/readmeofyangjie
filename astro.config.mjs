import { defineConfig } from 'astro/config';

const base = process.env.BASE_PATH || '/readmeofyangjie';

export default defineConfig({
  site: process.env.SITE_URL || 'https://YangjieHe228.github.io',
  base,
  output: 'static',
  outDir: process.env.OUT_DIR || './dist',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  vite: {
    cacheDir: '.astro/vite-cache',
    build: {
      cssMinify: true,
    },
  },
});
