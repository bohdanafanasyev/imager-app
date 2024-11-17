export async function getArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
    return new Response(blob).arrayBuffer()
}
