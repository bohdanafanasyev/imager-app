import { ensureInitialized, jsDecodeImage } from 'elheif'

/** Caches results from canBuiltInDecodeImageType */
const canDecodeCache = new Map<string, Promise<boolean>>()

export function canBuiltInDecodeImageType(type: string): Promise<boolean> {
    if (!canDecodeCache.has(type)) {
        const resultPromise = (async () => {
            const picture = document.createElement('picture')
            const img = document.createElement('img')
            const source = document.createElement('source')
            source.srcset = 'data:,x'
            source.type = type
            picture.append(source, img)

            // Wait a single microtick just for the `img.currentSrc` to get populated.
            await 0
            // At this point `img.currentSrc` will contain "data:,x" if format is supported and ""
            // otherwise.
            return !!img.currentSrc
        })()

        canDecodeCache.set(type, resultPromise)
    }

    return canDecodeCache.get(type)!
}

export async function elheifDecode(arrayBuffer: ArrayBuffer): Promise<ImageData> {
    await ensureInitialized()

    // @ts-expect-error - The result.data is a Uint8Array, but we need a clamped Uint8Array
    // also the return type is not ImageData
    return jsDecodeImage(new Uint8Array(arrayBuffer)).data[0]
}
