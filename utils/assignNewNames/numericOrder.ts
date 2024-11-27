import type { Image } from '~/types'

export function getNumericOrderNames(images: Image[], startingIndex: number) {
    images.forEach((image, index) => {
        image.newName = `Image ${index + startingIndex}`
    })
}
