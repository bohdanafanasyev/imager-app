export function debounce(func: (...args: unknown[]) => void, wait: number): (...args: unknown[]) => void {
    let timeout: ReturnType<typeof setTimeout> | undefined
    return (...args: unknown[]) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => func(...args), wait)
    }
}
