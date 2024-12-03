type PerformanceStats = {
    total: number
    lowest: number
    average: number
    highest: number
}

export type PerformanceData = {
    durations: {
        total: PerformanceStats
        encoding: PerformanceStats
        decoding: PerformanceStats
    }
    failedOptimizations: number
    successfulOptimizations: number
    size: {
        original: PerformanceStats
        optimised: PerformanceStats
        saved: PerformanceStats
        savedPercentage: PerformanceStats
    }
    co2Saved: {
        original: PerformanceStats
        optimised: PerformanceStats
        saved: PerformanceStats
        savedPercentage: PerformanceStats
    }
}

export type OptimisationStatistics = {
    total: PerformanceData
    formatsData: {
        [key: string]: PerformanceData
    }
    settings: {
        quality: string
        encoderFormat: string
    }
}
