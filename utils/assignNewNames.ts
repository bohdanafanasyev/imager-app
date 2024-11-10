import {
    differenceInCalendarDays,
    isSameDay
} from 'date-fns'
import type { Image } from '~/types'

const getRenamedFileName = (currentDay: number, date: Date): string => {
    const day = `Day ${currentDay}`
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    const time = `${hours}:${minutes}:${seconds}`

    return `${day} - ${time}`
}

export function assignNewNames(
    images: Image[],
    startingDay: number = 1
) {
    if (images.length) {
        // Assign names based on order
        let currentDay = startingDay
        let previousDate = images[0].creationDate
        const nameCountMap: { [key: string]: number } = {}

        images.forEach((image) => {
            if (previousDate && image.creationDate) {
                if (!isSameDay(previousDate, image.creationDate)) {
                    currentDay += differenceInCalendarDays(image.creationDate, previousDate)
                    previousDate = image.creationDate
                }

                let newName = getRenamedFileName(currentDay, image.creationDate)
                if (nameCountMap[newName]) {
                    newName = `${newName} (${nameCountMap[newName]})`
                    nameCountMap[newName] += 1
                }
                else {
                    nameCountMap[newName] = 1
                }

                image.newName = newName
            }
            else {
                // Todo error handling when date is not available
                console.error('Previous date is not available, as a result new names cannot be assigned')
                image.newName = image.file.name
            }
        })
    }
}
