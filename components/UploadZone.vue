<template>
    <div
        class='w-full pt-8 px-8 flex flex-col min-h-0
               lg:pr-1'
    >
        <div class='flex gap-4 mb-8'>
            <h4 class='gm-text-xl gm-text-strong'>
                Files
            </h4>
            <IconButton
                tag='label'
                for='file-input'
            >
                <span class='text-bold'>+</span>
            </IconButton>
            <IconButton
                v-if='!appStore.isDesktopUI'
                class='ml-auto'
                @click='appStore.showMobileSlideOver = true'
            >
                <NuxtImg
                    class='flex items-center justify-center relative w-3'
                    src='/icons/settings.svg'
                />
            </IconButton>
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
            v-show='imagesStore.images.size'
            name='list'
            tag='ul'
            class='flex flex-col gap-4 overflow-y-scroll flex-1'
        >
            <UploadedFile
                v-for='(image, key) in imagesStore.images'
                :key='key'
                :image='image[1]'
                :store-key='image[0]'
            />
        </TransitionGroup>

        <p
            v-show='!imagesStore.images.size'
            class='pr-8'
        >
            Select the files by clicking the plus icon
            <span class='opacity-50 italic'>(supported formats {{ displayedAcceptedImageTypes }})</span>
        </p>
    </div>
</template>

<script setup
        lang="ts"
>
import ExifReader from 'exifreader'
import { compareAsc } from 'date-fns'
import { SUPPORTED_IMAGE_TYPES_VALUES } from '~/values'
import type { Image } from '~/types'

const fileInput = ref<HTMLInputElement | null>(null)
const imagesStore = useImagesStore()
const appStore = useAppStore()

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

        imagesStore.addImages(imagesArray)
    }
}
</script>

<style scoped>
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
