export const IMAGE_TYPES = {
    avif: 'image/avif',
    heic: 'image/heic',
    heif: 'image/heif',
    jpeg: 'image/jpeg',
    jpg: 'image/jpg',
    png: 'image/png',
    webp: 'image/webp',
}

export const SUPPORTED_IMAGE_TYPES = Object.values(IMAGE_TYPES);

export const JSQUASH_DECODER_SUPPORTED_IMAGE_TYPES = [
    IMAGE_TYPES.webp,
    IMAGE_TYPES.jpeg,
    IMAGE_TYPES.jpg,
    IMAGE_TYPES.png,
    IMAGE_TYPES.avif,
]

export const ELHEIF_SUPPORTED_IMAGE_TYPES = [
    IMAGE_TYPES.heif,
    IMAGE_TYPES.heic,
]