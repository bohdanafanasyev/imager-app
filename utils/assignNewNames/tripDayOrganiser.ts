import {
    differenceInCalendarDays,
    isSameDay
} from 'date-fns'
import type { Image } from '~/types'

const getRenamedFileName = (currentDay: number, date: Date, use12hFormat: boolean): string => {
    const day = `Day ${currentDay}`
    let hours = date.getHours()
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    let period = ''

    if (use12hFormat) {
        period = hours >= 12 ? 'PM' : 'AM'
        hours = hours % 12 || 12 // Convert to 12-hour format
    }

    const formattedHours = String(hours).padStart(2, '0')
    const time = use12hFormat ? `${formattedHours}:${minutes}:${seconds} ${period}` : `${formattedHours}:${minutes}:${seconds}`

    return `${day} - ${time}`
}

export function getTripDayOrganiserNames(images: Image[], startingDay: number, use12hFormat: boolean) {
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

            let newName = getRenamedFileName(currentDay, image.creationDate, use12hFormat)
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
