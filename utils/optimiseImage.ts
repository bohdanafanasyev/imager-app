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

export function logPerformance(
    decodingDuration: number,
    encodingDuration: number,
    totalDuration: number,
    imageName: string
): void {
    if (isDebugMode()) {
        console.log(`Decoding: ${decodingDuration}s`)
        console.log(`Encoding: ${encodingDuration}s`)
        console.log(`Image ${imageName}: optimised in ${totalDuration}s`)
    }
}

export async function optimiseImage(image: Image, quality: number, encoderFormat: string): Promise<OptimisedImageResult> {
    const { file } = image

    if (!SUPPORTED_IMAGE_TYPES_VALUES.includes(file.type)) {
        throw new Error('Unsupported image type')
    }

    const totalStartTime = performance.now()
    const arrayBuffer = await file.arrayBuffer()

    let decodedImageData: ImageData
    let decodingDuration = 0

    if (JSQUASH_DECODER_SUPPORTED_IMAGE_TYPES.includes(file.type)) {
        ({
            result: decodedImageData,
            duration: decodingDuration
        } = await measurePerformance(() => jsquashDecode(file.type, arrayBuffer)))
        decodedImageData = await jsquashDecode(file.type, arrayBuffer)
    }
    else if (ELHEIF_SUPPORTED_IMAGE_TYPES.includes(file.type)) {
        ({
            result: decodedImageData,
            duration: decodingDuration
        } = await measurePerformance(() => elheifDecode(arrayBuffer)))
    }

    const {
        result: encodedArrayBuffer,
        duration: encodingDuration
    } = await measurePerformance(() => encodeImageData(decodedImageData, quality, encoderFormat))

    const totalEndTime = performance.now()
    const totalDuration = totalEndTime - totalStartTime
    const performanceStats = {
        decoding: formatMsToSeconds(decodingDuration),
        encoding: formatMsToSeconds(encodingDuration),
        total: formatMsToSeconds(totalDuration)
    }

    logPerformance(
        performanceStats.decoding,
        performanceStats.encoding,
        performanceStats.total,
        image.newName
    )

    return {
        arrayBuffer: encodedArrayBuffer,
        quality,
        encoderFormat,
        performance: performanceStats
    }
}
