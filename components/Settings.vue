<template>
    <div class='w-96 h-full separator border-gray-500 p-8'>
        <div class='flex gap-4 mb-8'>
            <h4 class='text-xl font-sans text-strong'>
                Settings
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
                    v-model='mainStore.optimise'
                    class='switch'
                    type='checkbox'
                >
            </div>

            <div
                v-if='mainStore.optimise'
                class='flex flex-col gap-4'
            >
                <div
                    v-for='stat in stats'
                    :key='stat.label'
                    class='flex text-xs place-items-center justify-between font-medium'
                >
                    <span class='text-ital'>{{ stat.label }}</span>
                    <span
                        :class="{
                            'text-green-500': stat.value && stat.highlight
                        }"
                    >{{ stat.value }}</span>
                </div>
            </div>

            <div class='flex'>
                <button
                    v-if='mainStore.optimise'
                    class='btn-secondary btn-sm ml-auto'
                    :class='{
                        ["pointer-events-none"]: mainStore.isOptimising || !mainStore.images.length
                    }'
                    :disabled='mainStore.isOptimising'
                    @click='processImages'
                >
                    <span class='btn-text'>Optimise</span>
                </button>
                <button
                    v-if='mainStore.allImagesOptimised || !mainStore.optimise'
                    class='btn-secondary btn-sm ml-auto'
                    @click='downloadImages'
                >
                    <span class='btn-text'>Download</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { filesize } from 'filesize'
import { IMAGE_TYPES } from '~/values'
import { formatCO2Emissions } from '~/utils/co2Emissions'

const mainStore = useMainStore()

const onStartingDayChange = () => {
    mainStore.assignNewNames()
}

const processImages = async (): Promise<void> => {
    if (mainStore.images.length) {
        mainStore.isOptimising = true

        for (const image of mainStore.images) {
            image.encodedArrayBuffer = await processImage(image)
            image.format.converted = getFileExtensionFromFileType(IMAGE_TYPES.webp)
        }
    }

    mainStore.isOptimising = false
}

const downloadImages = (): void => {
    downloadFiles(mainStore.images, mainStore.rename, mainStore.optimise)
}

const stats = computed(() => [
    {
        label: 'Uploaded files',
        value: mainStore.images.length > 0 ? mainStore.images.length : 'TBD'
    },
    {
        label: 'Optimised files',
        value: mainStore.images.length > 0 ? `${mainStore.totalOptimisedFiles} of ${mainStore.images.length}` : 'TBD'
    },
    {
        label: 'Uploaded size',
        value: mainStore.totalFilesSize ? filesize(mainStore.totalFilesSize) : 'TBD'
    },
    {
        label: 'Optimised size',
        value: mainStore.shouldGetOptimisedResult ? filesize(mainStore.optimisedFilesSize) : 'TBD',
        highlight: mainStore.shouldGetOptimisedResult
    },
    {
        label: 'Saved size',
        value: mainStore.shouldGetOptimisedResult ? `${filesize(mainStore.savedFilesSize)} (${mainStore.savedFilesPercentage}%)` : 'TBD'
    },
    {
        label: 'CO2 saved',
        value: mainStore.shouldGetOptimisedResult ? formatCO2Emissions(mainStore.co2Saved) : 'TBD',
        highlight: mainStore.shouldGetOptimisedResult
    }
])
</script>

<style>
.separator {
    border-inline-start: 1px solid hsla(0, 0%, 100%, .1);
}
</style>
