import { decode as jpegDecode } from "@jsquash/jpeg";
import { decode as webpDecode } from "@jsquash/webp";
import { decode as avifDecode } from "@jsquash/avif";
import { decode as pngDecode } from "@jsquash/png";
import { encode as avifEncode } from "@jsquash/jpeg";
import { encode as webpEncode } from "@jsquash/webp";
import { IMAGE_TYPES, SUPPORTED_IMAGE_TYPES } from '~/values'

const decoders = {
    [IMAGE_TYPES.avif]: avifDecode,
    [IMAGE_TYPES.jpeg]: jpegDecode,
    [IMAGE_TYPES.jpg]: jpegDecode,
    [IMAGE_TYPES.png]: pngDecode,
    [IMAGE_TYPES.webp]: webpDecode
}

const encoders = {
    [IMAGE_TYPES.avif]: avifEncode,
    [IMAGE_TYPES.webp]: webpEncode
}

const imageToArrayBuffer = (imageFile) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsArrayBuffer(imageFile);
    });
};

export async function processImagesSW (file) {
    if (SUPPORTED_IMAGE_TYPES.includes(file.type)) {
        const decoder = decoders[file.type];
        const encoder = encoders[IMAGE_TYPES.webp];

        const arrayBuffer = await imageToArrayBuffer(file);
        const decoded = await decoder(arrayBuffer);

        return await encoder(decoded);
    }
}