import type { Image } from '~/types'

export function getFullDateAndTimeNames(images: Image[], use12hour: boolean) {
    images.forEach((image, index) => {
        const date = image.creationDate ? new Date(image.creationDate) : null

        if (date) {
            image.newName = date.toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: use12hour
            })
        }
        else {
            // Todo error handling when date is not available
            console.error('Previous date is not available, as a result new names cannot be assigned')
            image.newName = image.file.name
        }
    })
}
