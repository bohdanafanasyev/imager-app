import {
    JSQUASH_DECODER_SUPPORTED_IMAGE_TYPES,
    ELHEIF_SUPPORTED_IMAGE_TYPES,
    SUPPORTED_IMAGE_TYPES_VALUES
} from '~/values'
import type {
    Image,
    OptimisedImageResult,
    OptimisedImageResultStatistics
} from '~/types'
import { roundToTwoDecimals } from '~/utils/format'

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

function getStatistics(
    decodingDuration: number,
    encodingDuration: number,
    totalStartTime: number,
    totalEndTime: number,
    arrayBuffer: ArrayBuffer | null,
    encodedArrayBuffer: ArrayBuffer | null
): OptimisedImageResultStatistics {
    let co2Saved = null
    let size = null

    if (arrayBuffer && encodedArrayBuffer) {
        const savedBytes = arrayBuffer.byteLength - encodedArrayBuffer.byteLength
        co2Saved = calculateCO2Emissions(arrayBuffer.byteLength, encodedArrayBuffer.byteLength)

        size = {
            original: arrayBuffer.byteLength,
            optimised: encodedArrayBuffer.byteLength,
            saved: savedBytes,
            savedPercentage: roundToTwoDecimals((savedBytes / arrayBuffer.byteLength) * 100)
        }
    }

    return {
        co2Saved,
        size,
        duration: {
            total: roundToTwoDecimals(totalEndTime - totalStartTime),
            decoding: roundToTwoDecimals(decodingDuration),
            encoding: roundToTwoDecimals(encodingDuration)
        }
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
        statistics: getStatistics(
            decodingDuration,
            encodingDuration,
            totalStartTime,
            totalEndTime,
            arrayBuffer,
            encodedArrayBuffer
        )
    }
}
