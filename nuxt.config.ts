import build from './config/build'
import css from './config/css'
import modules from './config/modules'
import tailwind from './config/tailwindcss'

export default defineNuxtConfig({
    ...build,
    ...css,
    ...modules,
    ...tailwind,
    app: {
        rootId: 'app'
    },
    eslint: {
        config: {
            stylistic: {
                semi: false,
                quotes: 'single',
                arrowParens: true,
                blockSpacing: true,
                indent: 4,
                commaDangle: 'never'
            }
        }
    },

    plugins: [
        '~/plugins/firebase.client.ts'
    ],

    routeRules: {
        '/_nuxt/**': {headers: {'cross-origin-embedder-policy': 'require-corp'}}
    },

    // Doesn't work if imported from config/vite.ts
    vite: {
        optimizeDeps: {
            exclude: [
                '@jsquash/png',
                '@jsquash/avif',
                '@jsquash/webp',
                '@jsquash/jpeg',
                'elheif'
            ]
        },
        worker: {
            format: 'es'
        }
    },

    compatibilityDate: '2024-04-03',

    typescript: {
        typeCheck: true
    },

    devtools: {
        enabled: true
    }
})