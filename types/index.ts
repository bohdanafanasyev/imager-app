import type { RENAME_OPTIONS, SUPPORTED_ENCODER_IMAGE_FORMATS } from '~/values'

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

export type RenameOptions = {
    enabled: boolean
    preset: typeof RENAME_OPTIONS[keyof typeof RENAME_OPTIONS]
    startingDay: string
    startingIndex: number
    use12hFormat: boolean
}

export type OptimiseOptions = {
    enabled: boolean
    format: typeof SUPPORTED_ENCODER_IMAGE_FORMATS[keyof typeof SUPPORTED_ENCODER_IMAGE_FORMATS]
    isOptimising: boolean
    lastSettings: {
        quality: string
        format: typeof SUPPORTED_ENCODER_IMAGE_FORMATS[keyof typeof SUPPORTED_ENCODER_IMAGE_FORMATS]
    }
    quality: string
}
