export function isDebugMode(): boolean {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('debug') === 'true';
}