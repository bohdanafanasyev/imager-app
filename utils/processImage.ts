import {
    JSQUASH_DECODER_SUPPORTED_IMAGE_TYPES,
    ELHEIF_SUPPORTED_IMAGE_TYPES,
    SUPPORTED_IMAGE_TYPES
} from '~/values'

export async function measurePerformance<T> (label: string, fn: () => Promise<T>): Promise<{
    result: T,
    duration: number
}> {
    const startTime = performance.now();
    const result = await fn();
    const endTime = performance.now();
    const duration = endTime - startTime;

    return {
        result,
        duration
    };
}

export function logPerformance(bufferRetrievalDuration: number, decodingDuration: number, encodingDuration: number, totalDuration: number, imageName: string): void {
    console.log(`Buffer: ${bufferRetrievalDuration} ms`);
    console.log(`Decoding: ${decodingDuration} ms`);
    console.log(`Encoding: ${encodingDuration} ms`);
    console.log(`Image ${imageName}: processed in ${totalDuration} ms`);
}

export async function processImage (image) {
    const {file} = image;

    if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
        throw new Error('Unsupported image type');
    }

    const totalStartTime = performance.now();

    const {
        result: arrayBuffer,
        duration: bufferRetrievalDuration
    } = await measurePerformance('Buffer Retrieval', () => file.arrayBuffer());

    let decodedImageData;
    let decodingDuration = 0;
    if (JSQUASH_DECODER_SUPPORTED_IMAGE_TYPES.includes(file.type)) {
        ({
            result: decodedImageData,
            duration: decodingDuration
        } = await measurePerformance('Decoding', () => jsquashDecode(file.type, arrayBuffer)));
    } else if (ELHEIF_SUPPORTED_IMAGE_TYPES.includes(file.type)) {
        ({
            result: decodedImageData,
            duration: decodingDuration
        } = await measurePerformance('Decoding', () => elheifDecode(file.type, arrayBuffer)));
    }

    const {
        result: encodedArrayBuffer,
        duration: encodingDuration
    } = await measurePerformance('Encoding', () => encodeImageData(decodedImageData));

    const totalEndTime = performance.now();
    const totalDuration = totalEndTime - totalStartTime;

    logPerformance(bufferRetrievalDuration, decodingDuration, encodingDuration, totalDuration, image.newName);

    return encodedArrayBuffer;
}