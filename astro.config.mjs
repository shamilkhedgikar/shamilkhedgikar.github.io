import { defineConfig } from 'astro/config'
import fulldevUi from 'fulldev-ui/integration'
import mdx from '@astrojs/mdx'   // add this

export default defineConfig({
  integrations: [
    mdx(),         // safe even if you don't have .mdx files yet
    fulldevUi({})
  ],
  // TEMPORARY shim for any deps still importing "astro/jsx/server.js"
  vite: {
    resolve: {
      alias: {
        'astro/jsx/server.js': '@astrojs/mdx/server.js'
      }
    }
  }
})