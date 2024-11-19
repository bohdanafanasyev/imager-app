import { encode as avifEncode } from '@jsquash/avif'
import { encode as webpEncode } from '@jsquash/webp'
import { IMAGE_FORMATS } from '~/values'

const encoders = {
    [IMAGE_FORMATS.avif]: avifEncode,
    [IMAGE_FORMATS.webp]: webpEncode
}

interface EncodeConfig {
    decodedImageData: ImageData
    quality: number
    encoderFormat: string
}

// Nuxt web worker can't receive multiple arguments, so we pass an object instead
export async function encodeImageData(config: EncodeConfig): Promise<ArrayBuffer | null> {
    const { decodedImageData, quality, encoderFormat } = config
    const encoder = encoders[encoderFormat]
    let result = null

    // Options can be live experimented with here:
    // https://squoosh.app/editor
    try {
        result = await encoder(
            decodedImageData,
            {
                quality,
                method: 6
            }
        )
    }
    catch (error) {
        console.log(error)
    }

    return result
}
