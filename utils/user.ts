function generateId(): string {
    return Math.random().toString(36).substr(2, 9)
}

export function getUserSessionId(): string {
    return generateId()
}

export function getUserId(): string {
    const localStorageKey = 'userId'
    let userId = localStorage.getItem(localStorageKey)

    if (!userId) {
        userId = generateId()
        localStorage.setItem(localStorageKey, userId)
    }

    return userId
}
