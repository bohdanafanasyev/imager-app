import build from './config/build'
import css from './config/css'
import modules from './config/modules'
import tailwind from './config/tailwindcss'
import vite from './config/vite'

export default defineNuxtConfig({
  ...build,
  ...css,
  ...modules,
  ...tailwind,
  ...vite,
  compatibilityDate: '2024-04-03',

  eslint: {
    config: {
      stylistic: {
        semi: false,
        quotes: 'single',
        arrowParens: true,
        blockSpacing: true,
        indent: 4,
        commaDangle: 'never',
      },
    },
  },

  typescript: {
      typeCheck: true
  },

  devtools: {
      enabled: true
  },
})