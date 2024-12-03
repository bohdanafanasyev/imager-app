import type {
    PerformanceData,
    OptimisationStatistics
} from '~/types'

type FormatCollectedSize = {
    original: number[]
    optimised: number[]
    saved: number[]
    savedPercentage: number[]
}

type FormatCollectedData = {
    successfulOptimizations: number
    failedOptimizations: number
    size: FormatCollectedSize
    co2Saved: FormatCollectedSize
    durations: {
        total: number[]
        encoding: number[]
        decoding: number[]
    }
}

const formatCollectedSizeData: FormatCollectedSize = {
    original: [],
    optimised: [],
    saved: [],
    savedPercentage: []
}

function calculateStats(values: number[]) {
    return {
        total: roundToTwoDecimals(values.reduce((a, b) => a + b, 0)),
        lowest: roundToTwoDecimals(Math.min(...values)),
        average: roundToTwoDecimals(values.reduce((a, b) => a + b, 0) / values.length),
        highest: roundToTwoDecimals(Math.max(...values))
    }
}

export function getOptimisationStatistics(): OptimisationStatistics {
    const imagesStore = useImagesStore()
    const images = imagesStore.images
    const formatsData: {
        [key: string]: FormatCollectedData
    } = {}

    for (const [_, image] of images.entries()) {
        const formatType = image.file.type

        if (!formatsData[formatType]) {
            formatsData[formatType] = {
                successfulOptimizations: 0,
                failedOptimizations: 0,
                size: cloneDeep(formatCollectedSizeData),
                co2Saved: cloneDeep(formatCollectedSizeData),
                durations: {
                    total: [],
                    encoding: [],
                    decoding: []
                }
            }
        }

        if (image.optimisationResult) {
            const formatData = formatsData[formatType]
            const { statistics } = image.optimisationResult
            const { duration, size, co2Saved } = statistics

            formatsData[formatType].successfulOptimizations++

            formatData.durations.total.push(duration.total)
            formatData.durations.encoding.push(duration.encoding)
            formatData.durations.decoding.push(duration.decoding)

            if (size) {
                formatData.size.optimised.push(size.optimised)
                formatData.size.original.push(size.original)
                formatData.size.savedPercentage.push(size.savedPercentage)
                formatData.size.saved.push(size.saved)
            }

            if (co2Saved) {
                formatData.co2Saved.optimised.push(co2Saved.optimised)
                formatData.co2Saved.original.push(co2Saved.original)
                formatData.co2Saved.savedPercentage.push(co2Saved.savedPercentage)
                formatData.co2Saved.saved.push(co2Saved.saved)
            }
        }
        else {
            formatsData[formatType].failedOptimizations++
        }
    }

    const formatsPerformanceData = Object.keys(formatsData).reduce((data, formatType) => {
        const formatData = formatsData[formatType]
        const format = getImageFormatFromFileType(formatType)

        data[format] = {
            successfulOptimizations: formatData.successfulOptimizations,
            failedOptimizations: formatData.failedOptimizations,
            durations: {
                total: calculateStats(formatData.durations.total),
                encoding: calculateStats(formatData.durations.encoding),
                decoding: calculateStats(formatData.durations.decoding)
            },
            size: {
                original: calculateStats(formatData.size.original),
                optimised: calculateStats(formatData.size.optimised),
                saved: calculateStats(formatData.size.saved),
                savedPercentage: calculateStats(formatData.size.savedPercentage)
            },
            co2Saved: {
                original: calculateStats(formatData.co2Saved.original),
                optimised: calculateStats(formatData.co2Saved.optimised),
                saved: calculateStats(formatData.co2Saved.saved),
                savedPercentage: calculateStats(formatData.co2Saved.savedPercentage)
            }
        }

        return data
    }, {} as { [key: string]: PerformanceData })

    const formatsDataValues = Object.values(formatsData)
    const totalPerformanceData: PerformanceData = {
        durations: {
            total: calculateStats(formatsDataValues.flatMap(({ durations }) => durations.total)),
            encoding: calculateStats(formatsDataValues.flatMap(({ durations }) => durations.encoding)),
            decoding: calculateStats(formatsDataValues.flatMap(({ durations }) => durations.decoding))
        },
        successfulOptimizations: formatsDataValues.reduce((result, { successfulOptimizations }) => result + successfulOptimizations, 0),
        failedOptimizations: formatsDataValues.reduce((result, { failedOptimizations }) => result + failedOptimizations, 0),
        size: {
            original: calculateStats(formatsDataValues.flatMap(({ size }) => size.original)),
            optimised: calculateStats(formatsDataValues.flatMap(({ size }) => size.optimised)),
            saved: calculateStats(formatsDataValues.flatMap(({ size }) => size.saved)),
            savedPercentage: calculateStats(formatsDataValues.flatMap(({ size }) => size.savedPercentage))
        },
        co2Saved: {
            original: calculateStats(formatsDataValues.flatMap(({ co2Saved }) => co2Saved.original)),
            optimised: calculateStats(formatsDataValues.flatMap(({ co2Saved }) => co2Saved.optimised)),
            saved: calculateStats(formatsDataValues.flatMap(({ co2Saved }) => co2Saved.saved)),
            savedPercentage: calculateStats(formatsDataValues.flatMap(({ co2Saved }) => co2Saved.savedPercentage))
        }
    }

    return {
        total: totalPerformanceData,
        formatsData: formatsPerformanceData,
        settings: {
            quality: imagesStore.optimiseOptions.quality,
            encoderFormat: imagesStore.optimiseOptions.format
        }
    }
}
