export const IMAGE_TYPES = {
    avif: 'image/avif',
    heic: 'image/heic',
    heif: 'image/heif',
    jpeg: 'image/jpeg',
    jpg: 'image/jpg',
    png: 'image/png',
    webp: 'image/webp',
    tiff: 'image/tiff'
}

export const SUPPORTED_IMAGE_TYPES = {
    avif: IMAGE_TYPES.avif,
    heic: IMAGE_TYPES.heic,
    heif: IMAGE_TYPES.heif,
    jpeg: IMAGE_TYPES.jpeg,
    jpg: IMAGE_TYPES.jpg,
    png: IMAGE_TYPES.png,
    webp: IMAGE_TYPES.webp
}

export const EXIFREADER_SUPPORTED_IMAGE_TYPES = [
    IMAGE_TYPES.avif,
    IMAGE_TYPES.heic,
    IMAGE_TYPES.heif,
    IMAGE_TYPES.jpeg,
    IMAGE_TYPES.jpg,
    IMAGE_TYPES.png,
    IMAGE_TYPES.tiff,
    IMAGE_TYPES.webp
]

export const SUPPORTED_IMAGE_TYPES_VALUES = Object.values(SUPPORTED_IMAGE_TYPES)

export const JSQUASH_DECODER_SUPPORTED_IMAGE_TYPES = [
    IMAGE_TYPES.webp,
    IMAGE_TYPES.jpeg,
    IMAGE_TYPES.jpg,
    IMAGE_TYPES.png,
    IMAGE_TYPES.avif
]

export const ELHEIF_SUPPORTED_IMAGE_TYPES = [
    IMAGE_TYPES.heif,
    IMAGE_TYPES.heic
]

// Check if all supported image types are supported by EXIF reader
const checkSupportedImageTypes = () => {
    const missingTypes = SUPPORTED_IMAGE_TYPES_VALUES.filter((type) => !EXIFREADER_SUPPORTED_IMAGE_TYPES.includes(type))

    if (missingTypes.length > 0) {
        console.error('The following supported image types enabled, but are not supported by EXIF reader:', missingTypes)
    }
}

checkSupportedImageTypes()
