export type PerformanceStats = {
    decoding: number
    encoding: number
    total: number
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

export type OptimisedImageResult = {
    arrayBuffer: ArrayBuffer | null
    quality: number
    encoderFormat: string
    performance: PerformanceStats
}

export interface DrawableToImageDataOptions {
    width?: number
    height?: number
    sx?: number
    sy?: number
    sw?: number
    sh?: number
}
