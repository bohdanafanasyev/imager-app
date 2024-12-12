import type { RequestOptions } from 'mixpanel-browser'
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
        userId: userStore!.id,
        sessionId: userStore!.sessionId,
        cycleId: optimisationIterationCount
    }
}

function createPayloadData(eventKey: InitialEventKey, trackingData?: object) {
    const initial = isInitialEvent[eventKey]
    isInitialEvent[eventKey] = false

    return {
        initial,
        ...trackingData,
        ...getUserData()
    }
}

function logAnalyticsEvent(
    eventName: string,
    payload: object,
    transport: RequestOptions['transport'] = 'xhr'
) {
    const { $analytics } = useNuxtApp()
    const appStore = useAppStore()

    if (appStore.isDebugMode) {
        console.log('Analytics event:', eventName, payload)
    }

    $analytics.track(eventName, payload, { transport })
}

export function trackImagesAdded(imagesAmount: number) {
    logAnalyticsEvent(
        ANALYTICS_EVENTS.imagesAdded,
        createPayloadData(eventKeys.imagesAdded, { imagesAmount })
    )
}

export function trackOptimisationStarted(imagesAmount: number) {
    logAnalyticsEvent(
        ANALYTICS_EVENTS.optimisationStarted,
        createPayloadData(eventKeys.optimisationStarted, { imagesAmount })
    )
}

export function trackOptimisationPaused() {
    logAnalyticsEvent(
        ANALYTICS_EVENTS.optimisationPaused,
        createPayloadData(eventKeys.optimisationPaused)
    )
}

export function trackOptimisationResumed(imagesAmount: number) {
    logAnalyticsEvent(
        ANALYTICS_EVENTS.optimisationResumed,
        createPayloadData(eventKeys.optimisationResumed, { imagesAmount })
    )
}

export function trackOptimisationCompleted(statistics: OptimisationStatistics | null) {
    logAnalyticsEvent(
        ANALYTICS_EVENTS.optimisationCompleted,
        createPayloadData(eventKeys.optimisationCompleted, { statistics })
    )
    optimisationIterationCount++
}

export function trackDownloadCompleted() {
    logAnalyticsEvent(
        ANALYTICS_EVENTS.downloadCompleted,
        createPayloadData(eventKeys.downloadCompleted)
    )
}

export function trackOptimisationAborted() {
    logAnalyticsEvent(
        ANALYTICS_EVENTS.optimisationAborted,
        createPayloadData(eventKeys.optimisationAborted),
        'sendBeacon'
    )
}
