import { getAnalytics, logEvent } from 'firebase/analytics'
import { ANALYTICS_EVENTS } from '~/values/analytics'
import type { PerformanceStats } from '~/types'
import { roundToTwoDecimals } from '~/utils/format'

export function trackOptimisationStarted() {
    const analytics = getAnalytics()

    logEvent(analytics, ANALYTICS_EVENTS.optimisationStarted)
}

type AnalyticsPerformanceStats = {
    total: number
    lowest: number
    average: number
    longest: number
}

interface PerformanceData {
    images: PerformanceStats[]
    errors: number
}

interface Formats {
    [key: string]: PerformanceData
}

/**
 * Get the following data:
 * Performance data per image format
 *   - Lowest duration
 *   - Average duration
 *   - Longest duration
 *   - Failed optimisations
 */
function getOptimisationResultData() {
    const imagesStore = useImagesStore()
    const images = imagesStore.images

    const durations: { total: number[], encoding: number[], decoding: number[] } = { total: [], encoding: [], decoding: [] }
    const formats: Formats = {}

    for (const [_, image] of images.entries()) {
        const format = image.file.type

        if (!formats[format]) {
            formats[format] = {
                images: [],
                errors: 0
            }
        }

        if (image.optimisationResult) {
            const { performance } = image.optimisationResult
            durations.total.push(performance.total)
            durations.encoding.push(performance.encoding)
            durations.decoding.push(performance.decoding)

            formats[format].images.push(performance)
        }
        else {
            formats[format].errors++
        }
    }

    const totalFailedOptimisations = Object.values(formats).reduce((acc, formatData) => acc + formatData.errors, 0)

    const calculateStats = (values: number[]) => ({
        total: roundToTwoDecimals(values.reduce((a, b) => a + b, 0)),
        lowest: Math.min(...values),
        average: roundToTwoDecimals(values.reduce((a, b) => a + b, 0) / values.length),
        longest: Math.max(...values)
    })

    const totalPerformanceData = {
        durations: {
            total: calculateStats(durations.total),
            encoding: calculateStats(durations.encoding),
            decoding: calculateStats(durations.decoding)
        },
        errors: roundToTwoDecimals(totalFailedOptimisations)
    }

    const formatPerformanceData = Object.keys(formats).reduce((acc, format) => {
        const formatDurations = {
            total: formats[format].images.map((performance) => performance.total),
            encoding: formats[format].images.map((performance) => performance.encoding),
            decoding: formats[format].images.map((performance) => performance.decoding)
        }

        acc[format] = {
            durations: {
                total: calculateStats(formatDurations.total),
                encoding: calculateStats(formatDurations.encoding),
                decoding: calculateStats(formatDurations.decoding)
            },
            errors: formats[format].errors
        }

        return acc
    }, {} as { [key: string]: { durations: { total: AnalyticsPerformanceStats, encoding: AnalyticsPerformanceStats, decoding: AnalyticsPerformanceStats }, errors: number } })

    return {
        total: totalPerformanceData,
        formats: formatPerformanceData,
        settings: {
            quality: imagesStore.optimiseOptions.quality,
            encoderFormat: imagesStore.optimiseOptions.format
        }
    }
}

export function trackOptimisationCompleted() {
    const analytics = getAnalytics()
    const data = getOptimisationResultData()

    logEvent(analytics, ANALYTICS_EVENTS.optimisationCompleted, { data: JSON.stringify(data) })
}

export function trackDownloadCompleted() {
    const analytics = getAnalytics()

    logEvent(analytics, ANALYTICS_EVENTS.downloadCompleted)
}
