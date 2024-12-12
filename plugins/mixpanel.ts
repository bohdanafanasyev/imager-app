// Import Mixpanel SDK
import mixpanel from 'mixpanel-browser'

export default defineNuxtPlugin((nuxtApp) => {
    const tokens = {
        local: 'b91ed126353f65635aed2c2cc8ce0c87',
        test: '686ef0f057ce341ec6efa6458bea0277',
        prod: '44c8265c334b42bb6230a34e2bfdeb5a'
    }

    function getToken() {
        const domain = window?.location.hostname
        let token = tokens.local

        if (domain?.includes('netlify')) {
            token = tokens.test
        }

        return token
    }

    mixpanel.init(getToken(), {
        debug: isDebugMode(),
        track_pageview: true,
        persistence: 'localStorage'
    })

    nuxtApp.vueApp.provide('analytics', mixpanel)
    nuxtApp.provide('analytics', mixpanel)
})
