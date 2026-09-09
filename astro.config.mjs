import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Astro 7 defaults to 'jsx' whitespace compression, which drops the space
  // between adjacent inline elements. Keep the previous behaviour.
  compressHTML: true,
  vite: {
    plugins: [tailwindcss()],
  },
});
