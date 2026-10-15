import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE_URL } from './src/config/site';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'never',
  build: { format: 'file' },
  compressHTML: true,
  markdown: { syntaxHighlight: false },
  vite: { build: { chunkSizeWarningLimit: 700 } }, // three.js se carga aparte, solo en la escena 3D
  integrations: [sitemap({ filter: (page) => !/\/(404|aviso-de-privacidad)/.test(page) })],
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Oswald',
      cssVariable: '--font-display',
      weights: [500, 600, 700],
      subsets: ['latin'],
      fallbacks: ['Arial Narrow', 'Arial', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Yellowtail',
      cssVariable: '--font-script',
      weights: [400],
      subsets: ['latin'],
      fallbacks: ['Brush Script MT', 'cursive'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Atkinson Hyperlegible Next',
      cssVariable: '--font-body',
      weights: [400, 700],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['Verdana', 'system-ui', 'sans-serif'],
    },
  ],
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'none'",
        'upgrade-insecure-requests',
      ],
    },
  },
});
