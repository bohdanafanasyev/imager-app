import { ANALYTICS_EVENTS } from '~/values/analytics'

export default defineNuxtPlugin(() => {
    if (window) {
        const originalFetch = window.fetch

        window.fetch = async function (resource, options) {
            if (typeof resource === 'string' && resource.includes(ANALYTICS_EVENTS.optimisationAborted)) {
                const analyticsStore = useAnalyticsStore()

                analyticsStore.abortEvent.url = resource

                if (options) {
                    analyticsStore.abortEvent.options = options
                }

                window.fetch = originalFetch

                return Promise.resolve(new Response(null, { status: 204 }))
            }

            return originalFetch(resource, options)
        }

        generateOptimisationAbortedLink()

        window.addEventListener('beforeunload', () => {
            trackOptimisationAborted()
        })
    }
})
