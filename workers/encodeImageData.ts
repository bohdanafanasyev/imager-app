import { encode as avifEncode } from '@jsquash/avif'
import { encode as webpEncode } from '@jsquash/webp'
import { IMAGE_FORMATS } from '~/values'

const encoders = {
    [IMAGE_FORMATS.avif]: avifEncode,
    [IMAGE_FORMATS.webp]: webpEncode
}

export async function encodeImageData(imageData: ImageData, quality: number, encoderFormat: string): Promise<ArrayBuffer> {
    const encoder = encoders[encoderFormat]

    // Options can be live experimented with here:
    // https://squoosh.app/editor
    return await encoder(
        imageData,
        {
            quality,
            method: 6
        })
}
