import {
    ensureInitialized,
    jsDecodeImage
} from 'elheif'

export async function elheifDecode (fileType: string, arrayBuffer: ArrayBuffer): Promise<ArrayBuffer> {
    await ensureInitialized()

    return jsDecodeImage(arrayBuffer).data[0]
}