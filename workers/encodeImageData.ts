import { IMAGE_TYPES } from '~/values'
import { encode as avifEncode } from '@jsquash/jpeg'
import { encode as webpEncode } from '@jsquash/webp'

const encoders = {
    [IMAGE_TYPES.avif]: avifEncode,
    [IMAGE_TYPES.webp]: webpEncode
}

export async function encodeImageData (imageData: ImageData): Promise<ArrayBuffer> {
    const encoder = encoders[IMAGE_TYPES.webp];

    return await encoder(imageData);
}