import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt()
    .override('nuxt/vue/rules', {
        rules: {
            'vue/multi-word-component-names': 'off',
            'vue/html-quotes': ['error', 'single', { avoidEscape: true }]
        }
    })
