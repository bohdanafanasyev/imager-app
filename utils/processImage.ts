import {
    JSQUASH_DECODER_SUPPORTED_IMAGE_TYPES,
    ELHEIF_SUPPORTED_IMAGE_TYPES,
    SUPPORTED_IMAGE_TYPES_VALUES
} from '~/values'
import type { Image } from '~/types'

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
    bufferRetrievalDuration: number,
    decodingDuration: number,
    encodingDuration: number,
    totalDuration: number,
    imageName: string
): void {
    if (isDebugMode()) {
        console.log(`Buffer: ${bufferRetrievalDuration}ms`)
        console.log(`Decoding: ${decodingDuration}ms`)
        console.log(`Encoding: ${encodingDuration}ms`)
        console.log(`Image ${imageName}: processed in ${totalDuration}ms`)
    }
}

export async function processImage(image: Image) {
    const { file } = image

    if (!SUPPORTED_IMAGE_TYPES_VALUES.includes(file.type)) {
        throw new Error('Unsupported image type')
    }

    const totalStartTime = performance.now()

    const {
        result: arrayBuffer,
        duration: bufferRetrievalDuration
    } = await measurePerformance(() => file.arrayBuffer())

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
    } = await measurePerformance(() => encodeImageData(decodedImageData))

    const totalEndTime = performance.now()
    const totalDuration = totalEndTime - totalStartTime

    logPerformance(bufferRetrievalDuration, decodingDuration, encodingDuration, totalDuration, image.newName)

    return encodedArrayBuffer
}
