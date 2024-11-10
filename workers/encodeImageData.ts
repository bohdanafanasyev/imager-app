import { encode as avifEncode } from '@jsquash/avif'
import { encode as webpEncode } from '@jsquash/webp'
import { IMAGE_TYPES } from '~/values'

const encoders = {
    [IMAGE_TYPES.avif]: avifEncode,
    [IMAGE_TYPES.webp]: webpEncode
}

export async function encodeImageData(imageData: ImageData): Promise<ArrayBuffer> {
    const encoder = encoders[IMAGE_TYPES.webp]

    return await encoder(imageData)
}
