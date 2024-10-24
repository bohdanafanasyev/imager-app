import libheif from 'libheif-js/libheif-wasm/libheif-bundle.mjs';

const { HeifDecoder } = libheif();
const heifDecoder = new HeifDecoder();

export async function getHeicImagePayload (buffer: Buffer) {
    const data = heifDecoder.decode(buffer);
    const image = data[0];
    const width = image.get_width();
    const height = image.get_height();

    const imageData = await new Promise((resolve, reject) => {
        image.display({data: new Uint8ClampedArray(width * height * 4), width, height}, (displayData) => {
            if (!displayData) {
                return reject(new Error('HEIF processing error'));
            }

            resolve(displayData);
        });
    });

    return {
        data: imageData.data,
        options: {raw: {width, height, channels: 4}}
    }
}