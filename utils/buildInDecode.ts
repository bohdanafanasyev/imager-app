import type { DrawableToImageDataOptions } from '~/types'

export async function builtInDecode(
    blob: Blob
): Promise<ImageData> {
    // Prefer createImageBitmap as it's the off-thread option for Firefox.
    const drawable = await (
        'createImageBitmap' in self ? createImageBitmap(blob) : blobToImg(blob)
    )

    return await drawableToImageData(drawable)
}

async function drawableToImageData(
    drawable: ImageBitmap | HTMLImageElement,
    options: DrawableToImageDataOptions = {}
): Promise<ImageData> {
    const {
        width = drawable.width,
        height = drawable.height,
        sx = 0,
        sy = 0,
        sw = drawable.width,
        sh = drawable.height
    } = options

    // Use OffscreenCanvas if available to avoid rendering on the main thread
    const canvas = 'OffscreenCanvas' in self
        ? new OffscreenCanvas(width, height)
        : document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    // Draw image onto canvas
    const ctx = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D
    if (!ctx) throw new Error('Could not create canvas context')
    ctx.drawImage(drawable, sx, sy, sw, sh, 0, 0, width, height)

    // Return ImageData
    return new Promise<ImageData>((resolve) => {
        // Use requestAnimationFrame to allow the browser to perform some other tasks and avoid blocking the main thread
        requestAnimationFrame(() => {
            if (canvas instanceof OffscreenCanvas) {
                resolve(ctx.getImageData(0, 0, width, height))
            }
            else {
                resolve((ctx as CanvasRenderingContext2D).getImageData(0, 0, width, height))
            }
        })
    })
}

async function blobToImg(blob: Blob): Promise<HTMLImageElement> {
    const url = URL.createObjectURL(blob)

    try {
        return await decodeImage(url)
    }
    finally {
        URL.revokeObjectURL(url)
    }
}

async function decodeImage(url: string): Promise<HTMLImageElement> {
    const img = new Image()
    img.decoding = 'async'
    img.src = url
    const loaded = new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = () => reject(Error('Image loading error'))
    })

    if (img.decode) {
        // Nice off-thread way supported in Safari/Chrome.
        // Safari throws on decode if the source is SVG.
        // https://bugs.webkit.org/show_bug.cgi?id=188347
        await img.decode().catch(() => null)
    }

    // Always await loaded, as we may have bailed due to the Safari bug above.
    await loaded
    return img
}
