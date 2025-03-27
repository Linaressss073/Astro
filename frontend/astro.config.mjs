import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [tailwind(), mdx()]
});
// Compare this snippet from frontend/vercel.json: