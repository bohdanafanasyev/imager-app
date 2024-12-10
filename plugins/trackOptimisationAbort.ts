import { ANALYTICS_EVENTS } from '~/values/analytics'

export default defineNuxtPlugin(() => {
    if (window) {
        const imagesStore = useImagesStore()
        const originalFetch = window.fetch
        const abortEvent = {
            url: '',
            options: {}
        }

        window.fetch = async function (resource, options) {
            if (typeof resource === 'string' && resource.includes(ANALYTICS_EVENTS.optimisationAborted)) {
                abortEvent.url = resource

                if (options) {
                    abortEvent.options = options
                }

                window.fetch = originalFetch

                return Promise.resolve(new Response(null, { status: 204 }))
            }

            return originalFetch(resource, options)
        }

        generateOptimisationAbortedLink()

        window.addEventListener('beforeunload', () => {
            if (imagesStore.optimiseOptions.isOptimising) {
                trackOptimisationAborted(abortEvent.url)
            }
        })
    }
})
