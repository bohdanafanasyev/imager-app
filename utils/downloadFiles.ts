import JSZip from 'jszip'
import { IMAGE_TYPES, SUPPORTED_ENCODER_IMAGE_FORMATS } from '~/values'
import type { Image } from '~/types'

function download(blob: Blob, fileName: string): void {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')

    a.href = url
    a.download = fileName
    a.click()
    URL.revokeObjectURL(url)
}

async function getFileDownloadData(image: Image, rename: boolean, optimise: boolean) {
    const file = optimise ? image.optimisationResult!.arrayBuffer : await image.file.arrayBuffer()
    const format = optimise ? SUPPORTED_ENCODER_IMAGE_FORMATS[image.optimisationResult!.encoderFormat] : image.format.original
    const name = rename ? image.newName : getFileNameWithoutExtension(image.file.name)
    const type = optimise ? IMAGE_TYPES.webp : image.file.type
    const fileName = `${name}.${format}`

    return {
        file,
        fileName,
        type
    }
}

// For now single file is disabled, since browser seems to influence the final name of the file
// Replacing the colon with a dash, for example in macOS
// async function downloadSingleFile(image: Image, rename: boolean, optimise: boolean): Promise<void> {
//     const { file, fileName, type } = await getFileDownloadData(image, rename, optimise)
//
//     if (file) {
//         const blob = new Blob([file], { type })
//
//         download(blob, fileName)
//     }
// }

async function downloadMultipleFiles(images: Map<string, Image>, rename: boolean, optimise: boolean): Promise<void> {
    const zip = new JSZip()

    for (const [key, image] of images) {
        const { file, fileName } = await getFileDownloadData(image, rename, optimise)

        if (file) {
            zip.file(fileName, file)
        }
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' })

    download(zipBlob, 'images.zip')
}

export async function downloadFiles(images: Map<string, Image>, rename: boolean, optimise: boolean): Promise<void> {
    return new Promise<void>(async (resolve) => {
        await downloadMultipleFiles(images, rename, optimise)
        resolve()
    })
}
