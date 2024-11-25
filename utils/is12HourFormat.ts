export function is12HourFormat(): boolean {
    const date = new Date()
    const formattedDate = new Intl.DateTimeFormat(navigator.language, {
        hour: 'numeric'
    }).format(date)

    return formattedDate.includes('AM') || formattedDate.includes('PM')
}
