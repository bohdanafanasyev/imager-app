import {
    JSQUASH_DECODER_SUPPORTED_IMAGE_TYPES,
    ELHEIF_SUPPORTED_IMAGE_TYPES,
    SUPPORTED_IMAGE_TYPES
} from '~/values'

export async function processImage (image) {
    const {file} = image;

    if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
        throw new Error('Unsupported image type');
    }

    const startTime = performance.now();
    const arrayBuffer = await file.arrayBuffer();
    let decodedImageData;

    if (JSQUASH_DECODER_SUPPORTED_IMAGE_TYPES.includes(file.type)) {
        decodedImageData = await jsquashDecode(file.type, arrayBuffer);
    } else if (ELHEIF_SUPPORTED_IMAGE_TYPES.includes(file.type)) {
        decodedImageData = await elheifDecode(image);
    }

    const encodedArrayBuffer = await encodeImageData(decodedImageData);
    const endTime = performance.now();
    const timeTaken = endTime - startTime;

    console.log(`Image ${ image.newName }: processed in ${ timeTaken } ms`);

    return encodedArrayBuffer;
}