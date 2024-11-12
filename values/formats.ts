export const IMAGE_FORMATS = {
    avif: 'avif',
    heic: 'heic',
    heif: 'heif',
    jpeg: 'jpeg',
    jpg: 'jpg',
    png: 'png',
    webp: 'webp',
    tiff: 'tiff'
}

export const IMAGE_TYPES = Object.fromEntries(
    Object.entries(IMAGE_FORMATS).map(([key, value]) => [key, `image/${value}`])
)

export const SUPPORTED_IMAGE_TYPES = {
    [IMAGE_FORMATS.avif]: IMAGE_TYPES.avif,
    [IMAGE_FORMATS.heic]: IMAGE_TYPES.heic,
    [IMAGE_FORMATS.heif]: IMAGE_TYPES.heif,
    [IMAGE_FORMATS.jpeg]: IMAGE_TYPES.jpeg,
    [IMAGE_FORMATS.jpg]: IMAGE_TYPES.jpg,
    [IMAGE_FORMATS.png]: IMAGE_TYPES.png,
    [IMAGE_FORMATS.webp]: IMAGE_TYPES.webp
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

export const SUPPORTED_ENCODER_IMAGE_FORMATS = {
    [IMAGE_FORMATS.avif]: IMAGE_FORMATS.avif,
    [IMAGE_FORMATS.webp]: IMAGE_FORMATS.webp
}

// Check if all supported image types are supported by EXIF reader
const checkSupportedImageTypes = () => {
    const missingTypes = SUPPORTED_IMAGE_TYPES_VALUES.filter((type) => !EXIFREADER_SUPPORTED_IMAGE_TYPES.includes(type))

    if (missingTypes.length > 0) {
        console.error('The following supported image types enabled, but are not supported by EXIF reader:', missingTypes)
    }
}

checkSupportedImageTypes()
