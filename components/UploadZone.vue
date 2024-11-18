<template>
    <div class='w-full py-8 pl-8 pr-1 flex flex-col'>
        <div class='flex gap-4 mb-8'>
            <h4 class='text-xl font-sans text-strong'>
                Files
            </h4>
            <label
                for='file-input'
                class='btn-secondary btn-icon-sm block'
            >
                <span class='z-20 text-bold'>+</span>
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

        <TransitionGroup
            v-show='mainStore.images.size'
            name='list'
            tag='ul'
            class='flex flex-col gap-4 overflow-y-scroll flex-1 custom-scroll pr-7'
        >
            <UploadedFile
                v-for='(image, key) in mainStore.images'
                :key='key'
                :image='image[1]'
                :store-key='image[0]'
            />
        </TransitionGroup>

        <p
            v-show='!mainStore.images.size'
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
import { compareAsc } from 'date-fns'
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

        image.format.original = getFileExtensionFromFileType(file.type)
        image.creationDate = creationDate
        image.thumbnail.url = URL.createObjectURL(file)
    }))
}

const onFileChange = async (): Promise<void> => {
    if (fileInput.value?.files) {
        const filesArray = Array.from(fileInput.value.files)
        const imagesArray: Image[] = filesArray.map((file) => ({
            file,
            newName: '',
            optimisationResult: null,
            creationDate: null,
            format: {
                original: '',
                optimised: ''
            },
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
</script>

<style scoped>
.custom-scroll {
    scrollbar-width: thin;
    scrollbar-color: rgb(72, 70, 70, 0.8) transparent;
}

.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
    transition: all 0.48s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
}

.list-leave-to {
    transform: translate(-10%, 100%);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
    position: absolute;
}
</style>
