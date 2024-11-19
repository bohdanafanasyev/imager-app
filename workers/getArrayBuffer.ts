// Nuxt web worker can't receive multiple arguments
export async function getArrayBuffer(blob: Blob): Promise<ArrayBuffer | null> {
    try {
        return await new Response(blob).arrayBuffer()
    }
    catch (error) {
        console.error('Failed to get array buffer:', error)
        return null
    }
}
