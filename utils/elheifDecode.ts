import {
    ensureInitialized,
    jsDecodeImage
} from 'elheif'

export async function elheifDecode(arrayBuffer: ArrayBuffer): Promise<ImageData> {
    await ensureInitialized()

    // @ts-expect-error - The result.data is a Uint8Array, but we need a clamped Uint8Array
    // also the return type is not ImageData
    return jsDecodeImage(new Uint8Array(arrayBuffer)).data[0]
}
