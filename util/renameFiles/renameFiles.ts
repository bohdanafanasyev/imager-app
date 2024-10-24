import {
    differenceInCalendarDays,
    isSameDay
} from 'date-fns'

const getRenamedFileName = (currentDay: string, date: Date) => {
    const day = `Day ${ currentDay }`;
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const time = `${ hours }:${ minutes }:${ seconds }`;

    return `${ day } - ${ time }`;
}

export function renameFiles (
    images: [],
    startingDay: number = 1,
) {
    // Assign names based on order
    let currentDay = startingDay;
    let previousDate = images[0].creationDate;

    debugger;

    images.forEach((file) => {
        if (!isSameDay(previousDate, file.creationDate)) {
            currentDay += differenceInCalendarDays(file.creationDate, previousDate);
            previousDate = file.creationDate;
        }

        // const format = file.name.split('.').pop()
        const newName = getRenamedFileName(currentDay, file.creationDate);

        file.newName = `${newName}`;
    })
}