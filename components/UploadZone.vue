<template>
    <div class='w-full py-8 pl-8 pr-1 flex flex-col'>
        <div class='flex gap-4 mb-8'>
            <h4 class='text-xl font-sans text-strong'>
                Files
            </h4>
            <label
                for='file-input'
                class='btn-secondary btn-sm block'
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
                :accept='SUPPORTED_IMAGE_TYPES'
                multiple
                @change='onFileChange'
            >
        </div>

        <transition-group
            v-show='mainStore.images.length'
            name='fade'
            tag='ul'
            class='flex flex-col gap-4 overflow-y-scroll flex-1 custom-scroll pr-7'
        >
            <li
                v-for='(image, index) in mainStore.images'
                :key='image.file.name'
                :style='{ transitionDelay: `${index * 60}ms` }'
                class='flex gap-4'
            >
                <div class='w-16 h-16 rounded-xl shadow-md overflow-clip relative'>
                    <img
                        v-if='!image.imageCantBeDisplayed'
                        :src='image.file.url'
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
                        v-if='mainStore.processing && !image.processedFile'
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
            </li>
        </transition-group>
        <p
            v-show='!mainStore.images.length'
            class='font-sans'
        >
            Select the files by clicking the plus icon
            <span class='opacity-50 italic'>(supported formats .heif, .heic, .avif, .webp, .jpg, .png)</span>
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
import { SUPPORTED_IMAGE_TYPES } from '~/values'

const fileInput = ref<HTMLInputElement | null>(null)
const mainStore = useMainStore()

const getDateFromExifDate = (exifDate) => {
    const [year, month, day, hour, minute, second] = exifDate.split(/\D/)
    return new Date(year, month - 1, day, hour, minute, second)
}

const getImagesData = async (filesArray: Array<File>): Promise<void> => {
    await Promise.all(filesArray.map(async (file) => {
        let creationDate = new Date(file.lastModified)

        if (!creationDate) {
            const metadata = await ExifReader.load(file, { async: true })

            if (metadata.DateTimeOriginal) {
                try {
                    creationDate = getDateFromExifDate(metadata.DateTimeOriginal.value[0])
                }
                catch (error) {
                    file.creationDate = null
                    console.error('Error parsing EXIF date', error)
                }
            }
        }

        file.creationDate = creationDate
        file.url = URL.createObjectURL(file)
    }))
}

const onFileChange = async (): Promise<void> => {
    if (fileInput.value?.files) {
        const filesArray = Array.from(fileInput.value.files)

        await getImagesData(filesArray)

        // Sort files by timestamp
        filesArray.sort((a, b) => compareAsc(a.creationDate, b.creationDate))
        mainStore.setImages(filesArray)
    }
}

// Some images may not be displayed because browsers don't support their format (e.g HEIC, sometimes AVIF)
const onImageError = (image: any): void => {
    image.imageCantBeDisplayed = true
}
</script>

<style lang="scss"
       scoped
>
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s, transform 0.5s;
}

.fade-enter-from, .fade-leave-to {
    opacity: 0;
    transform: translateY(5px);
}

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
