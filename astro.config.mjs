import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'   // add this

export default defineConfig({
  site: 'https://shamilkhedgikar.github.io',
  integrations: [
    mdx(),         // safe even if you don't have .mdx files yet
  ],
})
