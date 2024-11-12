/**
 * Converts milliseconds to seconds.
 * @param ms - The time in milliseconds.
 * @returns The time in seconds.
 */
export function formatMsToSeconds(ms: number): number {
    return Number((ms / 1000).toFixed(2))
}
