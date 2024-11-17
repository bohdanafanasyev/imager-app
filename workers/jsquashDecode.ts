import { decode as jpegDecode } from '@jsquash/jpeg'
import { decode as webpDecode } from '@jsquash/webp'
import { decode as avifDecode } from '@jsquash/avif'
import { decode as pngDecode } from '@jsquash/png'
import { IMAGE_TYPES } from '~/values'

const decoders = {
    [IMAGE_TYPES.avif]: avifDecode,
    [IMAGE_TYPES.jpeg]: jpegDecode,
    [IMAGE_TYPES.jpg]: jpegDecode,
    [IMAGE_TYPES.png]: pngDecode,
    [IMAGE_TYPES.webp]: webpDecode
}

export async function jsquashDecode(fileType: string, arrayBuffer: ArrayBuffer): Promise<ImageData | null> {
    let result = null

    // Options can be live experimented with here:
    // https://squoosh.app/editor
    try {
        result = await decoders[fileType](arrayBuffer)
    }
    catch (error) {
        console.log(error)
    }

    return result
}
