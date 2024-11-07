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

export function assignNewNames (
    files: { file: File, newName: '' }[],
    startingDay: number = 1
) {
    if (files.length) {
        // Assign names based on order
        let currentDay = startingDay;
        let previousDate = files[0].file.creationDate;

        files.forEach((item) => {
            if (item.file.creationDate) {
                if (!isSameDay(previousDate, item.file.creationDate)) {
                    currentDay += differenceInCalendarDays(item.file.creationDate, previousDate);
                    previousDate = item.file.creationDate;
                }

                const format = item.file.name.split('.').pop()
                const newName = getRenamedFileName(currentDay, item.file.creationDate);

                item.newName = `${ newName }.${ format }`;
            } else {
                // Todo error handling when date is not available
                item.newName = item.file.name;
            }
        })
    }
}

// export function assignNewNames (
//     files: { file: File, creationDate: Date }[],
//     startingDay: number = 1,
// ): File[] {
//     let currentDay = startingDay;
//     let previousDate = files[0].creationDate;
//     const renamedFiles: File[] = [];
//
//     files.forEach((image) => {
//         if (!isSameDay(previousDate, image.creationDate)) {
//             currentDay += differenceInCalendarDays(image.creationDate, previousDate);
//             previousDate = image.creationDate;
//         }
//
//         const newName = getRenamedFileName(currentDay, image.creationDate);
//         const newFile = new File([image.file], newName, { ...image });
//
//         renamedFiles.push(newFile);
//     });
//
//     return renamedFiles;
// }