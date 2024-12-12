// types/nuxt.d.ts
import type { Mixpanel } from '@types/mixpanel-browser'

declare module '#app' {
    interface NuxtApp {
        $analytics: Mixpanel
    }
}
