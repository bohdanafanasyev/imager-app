/**
 * Converts milliseconds to seconds.
 * @param ms - The time in milliseconds.
 * @returns The time in seconds.
 */
export function formatMsToSeconds(ms: number): number {
    return Number((ms / 1000).toFixed(2))
}

/**
 * Rounds a number to two decimal places.
 * @param num - The number to round.
 * @returns The number rounded to two decimal places.
 */
export function roundToTwoDecimals(num: number): number {
    return Math.floor(num * 100) / 100
}
