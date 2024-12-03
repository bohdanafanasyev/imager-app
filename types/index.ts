import type { RENAME_OPTIONS, SUPPORTED_ENCODER_IMAGE_FORMATS } from '~/values'

export * from './image'
export * from './statistics'

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
