import JSZip from 'jszip'
import { IMAGE_TYPES } from '~/values'
import type { Image } from '~/types'

function download(blob: Blob, fileName: string): void {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')

    a.href = url
    a.download = fileName
    a.click()
    URL.revokeObjectURL(url)
}

async function downloadSingleFile(image: Image, rename: boolean, optimise: boolean): Promise<void> {
    if (image.encodedArrayBuffer) {
        const blob = new Blob([image.encodedArrayBuffer], { type: IMAGE_TYPES.webp })
        const finalName = rename ? image.newName : getFileNameWithoutExtension(image.file.name)

        download(blob, `${finalName}.webp`)
    }
}

async function downloadMultipleFiles(images: Image[], rename: boolean, optimise: boolean): Promise<void> {
    const zip = new JSZip()

    for (let index = 0; index < images.length; index++) {
        const image = images[index]

        if (image.encodedArrayBuffer) {
            const finalName = rename ? image.newName : getFileNameWithoutExtension(image.file.name)
            zip.file(`${finalName}.webp`, image.encodedArrayBuffer)
        }
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' })

    download(zipBlob, 'images.zip')
}

export async function downloadFiles(images: Image[], rename: boolean, optimise: boolean): Promise<void> {
    if (images.length === 1) {
        await downloadSingleFile(images[0], rename, optimise)
    }
    else if (images.length > 1) {
        await downloadMultipleFiles(images, rename, optimise)
    }
}
