import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'   // add this

export default defineConfig({
  integrations: [
    mdx(),         // safe even if you don't have .mdx files yet
  ],
})
