// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',

    devtools: {
        enabled: true
    },

    serverMiddleware: [
        {
            path: '/api/upload',
            handler: '~/server/api/upload.ts'
        },
        {
            path: '/api/download',
            handler: '~/server/api/download.ts'
        }
    ],

    vite: {
        build: {
            rollupOptions: {
                external: [
                    "sharp"
                ]
            }
        }
    },

    env: {
        SHARP_IGNORE_GLOBAL_LIBVIPS: '1'
    },

    modules: ['@nuxt/image', '@nuxtjs/tailwindcss', '@nuxt/fonts', '@pinia/nuxt'],

    css: [
        '~/public/css/glass-3d.css',
        '~/public/css/fonts.css',
    ],

    tailwindcss: {
        config: {
            theme: {
                fontFamily: {
                    sans: [`Brandon`, `Avenir`, `Franklin Gothic`]
                }
            }
        }
    },
})