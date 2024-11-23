<template>
    <div class='flex flex-col gap-6'>
        <h5 class='gm-text-sm gm-text-strong'>
            Stats
        </h5>
        <div class='flex flex-col gap-4'>
            <div
                v-for='stat in stats'
                :key='stat.label'
                class='flex gm-text-xs place-items-center justify-between'
            >
                <span class='italic'>{{ stat.label }}</span>
                <span
                    :class="{
                        'text-green-500': stat.value && stat.highlight
                    }"
                >{{ stat.value }}</span>
            </div>
        </div>
    </div>
</template>

<script setup
        lang="ts"
>
import { filesize } from 'filesize'
import { formatCO2Emissions } from '~/utils/co2Emissions'

const imageStore = useImagesStore()

const stats = computed(() => [
    {
        label: 'Uploaded files',
        value: imageStore.images.size > 0 ? imageStore.images.size : 'TBD'
    },
    {
        label: 'Optimised files',
        value: imageStore.images.size > 0 ? `${imageStore.totalOptimisedFiles} of ${imageStore.images.size}` : 'TBD'
    },
    {
        label: 'Uploaded size',
        value: imageStore.totalFilesSize ? filesize(imageStore.totalFilesSize) : 'TBD'
    },
    {
        label: 'Optimised size',
        value: imageStore.shouldGetOptimisedResult ? filesize(imageStore.optimisedFilesSize) : 'TBD',
        highlight: imageStore.shouldGetOptimisedResult
    },
    {
        label: 'Saved size',
        value: imageStore.shouldGetOptimisedResult ? `${filesize(imageStore.savedFilesSize)} (${imageStore.savedFilesPercentage}%)` : 'TBD'
    },
    {
        label: 'CO2 saved',
        value: imageStore.shouldGetOptimisedResult ? formatCO2Emissions(imageStore.co2Saved) : 'TBD',
        highlight: imageStore.shouldGetOptimisedResult
    }
])
</script>
