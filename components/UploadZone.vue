<template>
    <div class='w-full py-8 pl-8 pr-1 flex flex-col'>
        <div class='flex gap-4 mb-8'>
            <h4 class='text-xl font-sans text-strong'>
                Files
            </h4>
            <label
                for='file-input'
                class='btn-secondary btn-sm block'
                style='padding: 0 14px'
            >
                <span class='btn-text'>
                    +
                </span>
            </label>
            <input
                id='file-input'
                ref='fileInput'
                type='file'
                class='hidden'
                :accept='acceptedImageTypes'
                multiple
                @change='onFileChange'
            >
        </div>

        <ul
            v-show='mainStore.images.length'
            class='flex flex-col gap-4 overflow-y-scroll flex-1 custom-scroll pr-7'
        >
            <li
                v-for='(image, index) in mainStore.images'
                :key='image.file.name'
                :style='{ transitionDelay: `${index * 60}ms` }'
                class='flex gap-4 group'
            >
                <div class='w-16 h-16 rounded-xl shadow-md overflow-clip relative'>
                    <img
                        v-if='!image.thumbnail.loadError'
                        :src='image.thumbnail.url'
                        :alt='image.file.name'
                        class='w-full h-full object-cover'
                        @error.once='onImageError(image)'
                    >
                    <div
                        v-else
                        class='glass-3d tint-2xdark h-full w-full flex items-center justify-center'
                    >
                        <PhotoIcon class='w-6' />
                    </div>
                    <div
                        v-if='mainStore.processing && !image.encodedArrayBuffer'
                        class='tint-3xdark z-10 absolute inset-0 w-full h-full grid place-items-center'
                    >
                        <div class='spinner' />
                    </div>
                </div>
                <div class='flex flex-col gap-1 justify-center'>
                    <p class='font-sans text-s'>
                        {{ mainStore.rename ? image.newName : image.file.name }}
                    </p>
                    <p class='font-sans text-xs text-gray-400'>
                        {{ filesize(image.file.size) }}
                    </p>
                </div>
                <div class='flex items-center opacity-0 transition-opacity group-hover:opacity-100 ml-auto'>
                    <button
                        class='font-medium text-xs text-gray-400 hover:text-gray-200 p-4'
                        @click='mainStore.removeImage(index)'
                    >
                        Delete
                    </button>
                </div>
            </li>
        </ul>
        <p
            v-show='!mainStore.images.length'
            class='font-sans'
        >
            Select the files by clicking the plus icon
            <span class='opacity-50 italic'>(supported formats {{ displayedAcceptedImageTypes }})</span>
        </p>
    </div>
</template>

<script setup
        lang="ts"
>
import { ref } from 'vue'
import ExifReader from 'exifreader'
import { filesize } from 'filesize'
import { compareAsc } from 'date-fns'
import PhotoIcon from '~/components/PhotoIcon.vue'
import { SUPPORTED_IMAGE_TYPES_VALUES } from '~/values'
import type { Image } from '~/types'

const fileInput = ref<HTMLInputElement | null>(null)
const mainStore = useMainStore()

const acceptedImageTypes = SUPPORTED_IMAGE_TYPES_VALUES.join(',')
const displayedAcceptedImageTypes = acceptedImageTypes.replace(/image\//g, ' .')

const getDateFromExifDate = (exifDate: string) => {
    const [year, month, day, hour, minute, second] = exifDate.split(/\D/)

    return new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute),
        Number(second)
    )
}

const getExifDateDateTimeOriginal = (dateTimeOriginal: ExifReader.StringArrayTag | undefined): string | undefined => {
    if (dateTimeOriginal) {
        if (dateTimeOriginal.value && Array.isArray(dateTimeOriginal.value)) {
            return dateTimeOriginal.value[0]
        }
    }

    return undefined
}

const setImageData = async (images: Image[]): Promise<void> => {
    await Promise.all(images.map(async (image) => {
        const { file } = image
        let creationDate = new Date(file.lastModified)

        if (!creationDate) {
            const metadata = await ExifReader.load(file, { async: true })
            const dateTimeOriginal = metadata.DateTimeOriginal as ExifReader.StringArrayTag | undefined
            const date: string | undefined = getExifDateDateTimeOriginal(dateTimeOriginal)

            if (date) {
                creationDate = getDateFromExifDate(date)
            }
            else {
                console.error('No creation date available', file.name)
            }
        }

        image.creationDate = creationDate
        image.thumbnail.url = URL.createObjectURL(file)
    }))
}

const onFileChange = async (): Promise<void> => {
    if (fileInput.value?.files) {
        const filesArray = Array.from(fileInput.value.files)
        const imagesArray: Image[] = filesArray.map((file) => ({
            file,
            imageCantBeDisplayed: false,
            newName: '',
            encodedArrayBuffer: null,
            creationDate: null,
            thumbnail: {
                url: '',
                loadError: false
            }
        }))

        await setImageData(imagesArray)

        // Sort files by timestamp
        // Ensure that images without a creationDate are placed at the end of the sorted array
        imagesArray.sort((a, b) => {
            if (!a.creationDate && !b.creationDate) {
                return 0
            }

            if (!a.creationDate) {
                return 1
            }

            if (!b.creationDate) {
                return -1
            }

            return compareAsc(a.creationDate, b.creationDate)
        })

        mainStore.addImages(imagesArray)
    }
}

// Some images may not be displayed because browsers don't support their format (e.g. HEIC, sometimes AVIF)
const onImageError = (image: Image): void => {
    image.thumbnail.loadError = true
}
</script>

<style lang="scss"
       scoped
>
.custom-scroll {
    scrollbar-width: thin;
    scrollbar-color: rgb(72, 70, 70, 0.8) transparent;
}

.spinner {
    width: 18px;
    height: 18px;

    animation: rotation 800ms linear infinite;

    &::before,
    &::after {
        content: '';
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        position: absolute;
        top: 0;
        left: 0;
        border: 2px solid transparent;
    }

    &::before {
        border-top-color: hsl(0, 0%, 90%);
        border-left-color: hsl(0, 0%, 90%);
    }

    &::after {
        border-color: hsla(0, 0%, 90%, 30%);
    }
}

@keyframes rotation {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
