<template>
    <div class='w-96 h-full separator border-gray-500 p-8'>
        <div class='flex gap-4 mb-8'>
            <h4 class='text-xl font-sans text-strong'>
                Process
            </h4>
        </div>

        <div class='gap-8 flex flex-col'>
            <div class='input-group flex justify-between'>
                <label class='text-l font-sans text-strong'>
                    Rename
                </label>

                <input
                    v-model='mainStore.rename'
                    class='switch'
                    type='checkbox'
                >
            </div>

            <div class='gap-4 flex flex-col'>
                <h5 class='text-l font-sans text-strong'>
                    File staring date
                </h5>
                <div class='text-input-bg spotlight'>
                    <select
                        v-model='mainStore.startingDate'
                        class='text-input'
                        name='text-input'
                        :disabled='!mainStore.rename'
                        @change='onStartingDayChange'
                    >
                        <option
                            selected
                            value='1'
                        >
                            Day 1
                        </option>
                        <option
                            v-for='i in 29'
                            :key='i + 1'
                            :value='i + 1'
                        >
                            Day {{ i + 1 }}
                        </option>
                    </select>
                </div>
            </div>

            <div class='input-group flex justify-between'>
                <label class='text-l font-sans text-strong'>
                    Optimise size
                </label>

                <input
                    v-model='mainStore.optimiseSize'
                    class='switch'
                    type='checkbox'
                >
            </div>

            <div class='flex flex-col gap-4'>
                <div class='flex text-xs place-items-center justify-between font-medium'>
                    <span class='text-ital'>Uploaded size</span>
                    <span>
                        {{ mainStore.totalFilesSize ? filesize(mainStore.totalFilesSize) : "TBD" }}
                    </span>
                </div>
                <div class='flex text-xs place-items-center justify-between font-medium'>
                    <span class='text-ital'>Optimised size</span>
                    <span>
                        {{ mainStore.optimisedFilesSize > 0 ? filesize(mainStore.optimisedFilesSize) : "TBD" }}
                    </span>
                </div>
                <div class='flex text-xs place-items-center justify-between font-medium'>
                    <span class='text-ital'>Saved size</span>
                    <span>
                        {{
                            mainStore.savedFilesSize > 0 ? `${filesize(mainStore.savedFilesSize)} (${mainStore.savedFilesPercentage}%)` : "TBD"
                        }}
                    </span>
                </div>
            </div>

            <div class='flex'>
                <button
                    class='btn-secondary btn-sm ml-auto'
                    @click='processImages'
                >
                    <span class='btn-text'>Process</span>
                </button>
                <button
                    v-if='mainStore.allImagesProcessed'
                    class='btn-secondary btn-sm ml-auto'
                    @click='downloadImages'
                >
                    <span class='btn-text'>Download</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup
        lang="ts"
>
import { filesize } from 'filesize'

const mainStore = useMainStore()

const onStartingDayChange = () => {
    mainStore.assignNewNames()
}

const processImages = async (): Promise<void> => {
    if (mainStore.images.length) {
        mainStore.processing = true

        for (const image of mainStore.images) {
            image.encodedArrayBuffer = await processImage(image)
        }
    }

    mainStore.processing = false
}

const downloadImages = (): void => {
    downloadFiles(mainStore.images, mainStore.rename)
}
</script>

<style>
.separator {
    border-inline-start: 1px solid hsla(0, 0%, 100%, .1);
}
</style>
