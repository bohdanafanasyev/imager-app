import type { Image } from '~/types'

export function getNumericOrderNames(images: Image[], startingIndex: number) {
    const indexIncrementor = startingIndex + 1

    images.forEach((image, index) => {
        image.newName = `Image ${index + indexIncrementor}`
    })
}
