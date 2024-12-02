import { getAnalytics, logEvent } from 'firebase/analytics'
import { ANALYTICS_EVENTS } from '~/values/analytics'
import { getOptimisationTrackingData } from '~/utils/analytics/getOptimisationTrackingData'

export function trackOptimisationStarted() {
    const analytics = getAnalytics()

    logEvent(analytics, ANALYTICS_EVENTS.optimisationStarted)
}

export function trackOptimisationCompleted() {
    const analytics = getAnalytics()
    const data = getOptimisationTrackingData()

    logEvent(analytics, ANALYTICS_EVENTS.optimisationCompleted, { data: JSON.stringify(data) })
}

export function trackDownloadCompleted() {
    const analytics = getAnalytics()

    logEvent(analytics, ANALYTICS_EVENTS.downloadCompleted)
}
