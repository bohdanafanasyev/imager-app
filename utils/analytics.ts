import { getAnalytics, logEvent } from 'firebase/analytics'
import { ANALYTICS_EVENTS } from '~/values/analytics'

export function trackOptimisationStarted() {
    const analytics = getAnalytics()

    logEvent(analytics, ANALYTICS_EVENTS.optimisationStarted)
}

export function trackOptimisationCompleted() {
    const analytics = getAnalytics()

    logEvent(analytics, ANALYTICS_EVENTS.optimisationCompleted)
}

export function trackDownloadCompleted() {
    const analytics = getAnalytics()

    logEvent(analytics, ANALYTICS_EVENTS.downloadCompleted)
}
