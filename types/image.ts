export type ImageStatisticsData = {
    optimised: number
    original: number
    savedPercentage: number
    saved: number
}

export type OptimisedImageResultStatistics = {
    co2Saved: ImageStatisticsData | null
    size: ImageStatisticsData | null
    duration: {
        total: number
        decoding: number
        encoding: number
    }
}

export type OptimisedImageResult = {
    arrayBuffer: ArrayBuffer | null
    statistics: OptimisedImageResultStatistics
}

export type Image = {
    file: File
    newName: string
    optimisationResult: OptimisedImageResult | null
    creationDate: Date | null
    format: {
        original: string
        optimised: string
    }
    thumbnail: {
        url: string
        loadError: boolean
    }
}
