import {
    JSQUASH_DECODER_SUPPORTED_IMAGE_TYPES,
    ELHEIF_SUPPORTED_IMAGE_TYPES,
    SUPPORTED_IMAGE_TYPES_VALUES
} from '~/values'
import type { Image, OptimisedImageResult } from '~/types'
import { formatMsToSeconds } from '~/utils/format'

async function measurePerformance<T>(fn: () => Promise<T>) {
    const startTime = performance.now()
    const result = await fn()
    const endTime = performance.now()
    const duration = endTime - startTime

    return {
        result,
        duration
    }
}

export async function optimiseImage(image: Image, quality: number, encoderFormat: string): Promise<OptimisedImageResult> {
    const { file } = image

    if (!SUPPORTED_IMAGE_TYPES_VALUES.includes(file.type)) {
        throw new Error('Unsupported image type')
    }

    const totalStartTime = performance.now()
    const arrayBuffer = await getArrayBuffer(file)

    let encodedArrayBuffer: ArrayBuffer | null = null
    let decodingDuration = 0
    let encodingDuration = 0

    if (arrayBuffer) {
        let decodedImageData: ImageData | null = null

        if (JSQUASH_DECODER_SUPPORTED_IMAGE_TYPES.includes(file.type)) {
            if (await canBuiltInDecodeImageType(file.type)) {
                let useFallbackDecoders = false

                try {
                    ({
                        result: decodedImageData,
                        duration: decodingDuration
                    } = await measurePerformance(() => builtInDecode(file)))
                }
                catch (error) {
                    useFallbackDecoders = true
                    console.log(error)
                }

                if (useFallbackDecoders) {
                    ({
                        result: decodedImageData,
                        duration: decodingDuration
                    } = await measurePerformance(() => jsquashDecode({
                        fileType: file.type,
                        arrayBuffer
                    })))
                }
            }
        }

        if (ELHEIF_SUPPORTED_IMAGE_TYPES.includes(file.type)) {
            ({
                result: decodedImageData,
                duration: decodingDuration
            } = await measurePerformance(() => elheifDecode(arrayBuffer)))
        }

        if (decodedImageData) {
            ({
                result: encodedArrayBuffer,
                duration: encodingDuration
            } = await measurePerformance(() => encodeImageData({
                decodedImageData,
                quality,
                encoderFormat
            })))
        }
    }

    const totalEndTime = performance.now()

    return {
        arrayBuffer: encodedArrayBuffer,
        performance: {
            decoding: formatMsToSeconds(decodingDuration),
            encoding: formatMsToSeconds(encodingDuration),
            total: formatMsToSeconds(totalEndTime - totalStartTime)
        }
    }
}
