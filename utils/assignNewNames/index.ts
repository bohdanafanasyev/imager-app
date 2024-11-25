import { getTripDayOrganiserNames } from './tripDayOrganiser'
import { getNumericOrderNames } from './numericOrder'
import { getFullDateAndTimeNames } from './fullDateAndTime'
import type {
    Image,
    RenameOptions
} from '~/types'
import { RENAME_OPTIONS } from '~/values'

export function assignNewNames(
    images: Image[],
    options: RenameOptions
) {
    if (images.length) {
        switch (options.preset) {
            case RENAME_OPTIONS.tripDayOrganiser:
                getTripDayOrganiserNames(images, Number(options.startingDay), options.use12hFormat)
                break
            case RENAME_OPTIONS.numericOrder:
                getNumericOrderNames(images, options.startingIndex)
                break
            case RENAME_OPTIONS.fullDateAndTime:
                getFullDateAndTimeNames(images, options.use12hFormat)
                break
            default:
                console.error('Invalid rename')
        }
    }
}
