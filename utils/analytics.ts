import type { Analytics } from 'firebase/analytics'
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
let analytics: Analytics | null = null

function getUserData() {
    const userStore = useUserStore()

    return {
        userId: userStore!.id,
        sessionId: userStore!.sessionId,
        cycleId: optimisationIterationCount
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

async function logAnalyticsEvent(eventName: string, payload: object) {
    if (analytics === null) {
        analytics = getAnalytics()
    }
    console.warn(`Logging event: ${eventName}`, payload)

    await logEvent(analytics, eventName, payload)
}

export async function trackImagesAdded(imagesAmount: number) {
    await logAnalyticsEvent(
        ANALYTICS_EVENTS.imagesAdded,
        createPayloadData(eventKeys.imagesAdded, { imagesAmount })
    )
}

export async function trackOptimisationStarted(imagesAmount: number) {
    await logAnalyticsEvent(
        ANALYTICS_EVENTS.optimisationStarted,
        createPayloadData(eventKeys.optimisationStarted, { imagesAmount })
    )
}

export async function trackOptimisationPaused() {
    await logAnalyticsEvent(
        ANALYTICS_EVENTS.optimisationPaused,
        createPayloadData(eventKeys.optimisationPaused)
    )
}

export async function trackOptimisationResumed(imagesAmount: number) {
    await logAnalyticsEvent(
        ANALYTICS_EVENTS.optimisationResumed,
        createPayloadData(eventKeys.optimisationResumed, { imagesAmount })
    )
}

export async function trackOptimisationCompleted(statistics: OptimisationStatistics | null) {
    await logAnalyticsEvent(
        ANALYTICS_EVENTS.optimisationCompleted,
        createPayloadData(eventKeys.optimisationCompleted, { statistics })
    )
    optimisationIterationCount++
}

export async function trackDownloadCompleted() {
    await logAnalyticsEvent(
        ANALYTICS_EVENTS.downloadCompleted,
        createPayloadData(eventKeys.downloadCompleted)
    )
}

export function trackOptimisationAborted(url: string) {
    navigator.sendBeacon(url)
}

export function generateOptimisationAbortedLink() {
    const analytics = getAnalytics()

    logEvent(
        analytics,
        ANALYTICS_EVENTS.optimisationAborted
    )
}
