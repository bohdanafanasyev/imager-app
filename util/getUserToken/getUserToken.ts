export function generateUserToken() {
    return 'user_' + Math.random().toString(36).substr(2, 9);
}

export function getUserToken() {
    let token = localStorage.getItem('userToken');

    if (!token) {
        token = generateUserToken();
    }

    return token;
}