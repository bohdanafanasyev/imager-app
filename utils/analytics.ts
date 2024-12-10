import { getAnalytics, logEvent } from 'firebase/analytics'
import type { OptimisationStatistics } from '~/types'
import { ANALYTICS_EVENTS } from '~/values/analytics'

type InitialEventKey = keyof typeof eventKeys

const eventKeys = Object.fromEntries(
    Object.keys(ANALYTICS_EVENTS).map((key) => [key, key])
)
const isInitialEvent = Object.fromEntries(
    Object.keys(eventKeys).map((key) => [key, true])
)
let optimisationIterationCount = 1

function getUserData() {
    const userStore = useUserStore()

    return {
        id: userStore!.id,
        sessionId: userStore!.sessionId,
        optimisationIteration: optimisationIterationCount
    }
}

function createPayloadData(eventKey: InitialEventKey, trackingData?: object) {
    const initial = isInitialEvent[eventKey]
    isInitialEvent[eventKey] = false

    return {
        data: JSON.stringify({
            initial,
            ...trackingData,
            ...getUserData()
        })
    }
}

export function trackImagesAdded(imagesAmount: number) {
    const analytics = getAnalytics()

    logEvent(
        analytics,
        ANALYTICS_EVENTS.imagesAdded,
        createPayloadData(
            eventKeys.imagesAdded,
            {
                imagesAmount
            }
        )
    )
}

export function trackOptimisationStarted(imagesAmount: number) {
    const analytics = getAnalytics()

    logEvent(
        analytics,
        ANALYTICS_EVENTS.optimisationStarted,
        createPayloadData(
            eventKeys.optimisationStarted,
            {
                imagesAmount
            }
        )
    )
}

export function trackOptimisationPaused() {
    const analytics = getAnalytics()

    logEvent(
        analytics,
        ANALYTICS_EVENTS.optimisationPaused,
        createPayloadData(eventKeys.optimisationPaused)
    )
}

export function trackOptimisationResumed(imagesAmount: number) {
    const analytics = getAnalytics()

    logEvent(
        analytics,
        ANALYTICS_EVENTS.optimisationResumed,
        createPayloadData(
            eventKeys.optimisationResumed,
            {
                imagesAmount
            }
        )
    )
}

export function trackOptimisationCompleted(statistics: OptimisationStatistics | null) {
    const analytics = getAnalytics()

    logEvent(
        analytics,
        ANALYTICS_EVENTS.optimisationCompleted,
        createPayloadData(
            eventKeys.optimisationCompleted,
            {
                statistics
            }
        )
    )

    optimisationIterationCount++
}

export function trackDownloadCompleted() {
    const analytics = getAnalytics()

    logEvent(
        analytics,
        ANALYTICS_EVENTS.downloadCompleted,
        createPayloadData(eventKeys.downloadCompleted)
    )
}

export function trackOptimisationAborted() {
    const analyticsStore = useAnalyticsStore()
    const imagesStore = useImagesStore()

    if (imagesStore.optimiseOptions.isOptimising) {
        navigator.sendBeacon(analyticsStore.abortEvent.url)
    }
}

export function generateOptimisationAbortedLink() {
    const analytics = getAnalytics()

    logEvent(
        analytics,
        ANALYTICS_EVENTS.optimisationAborted
    )
}
