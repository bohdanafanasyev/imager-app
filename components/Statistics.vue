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
                <span class='gm-text-strong'>{{ stat.label }}</span>
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

const imagesStore = useImagesStore()

const stats = computed(() => [
    {
        label: 'Uploaded files',
        value: imagesStore.images.size > 0 ? imagesStore.images.size : 'TBD'
    },
    {
        label: 'Optimised files',
        value: imagesStore.images.size > 0 ? `${imagesStore.totalOptimisedFiles} of ${imagesStore.images.size}` : 'TBD'
    },
    {
        label: 'Uploaded size',
        value: imagesStore.totalFilesSize ? filesize(imagesStore.totalFilesSize) : 'TBD'
    },
    {
        label: 'Optimised size',
        value: imagesStore.shouldGetOptimisedResult && imagesStore.statistics
            ? filesize(imagesStore.statistics.total.size.optimised.total)
            : 'TBD',
        highlight: imagesStore.shouldGetOptimisedResult
    },
    {
        label: 'Saved size',
        value: imagesStore.shouldGetOptimisedResult && imagesStore.statistics
            ? `${filesize(imagesStore.statistics.total.size.saved.total)} (${imagesStore.statistics.total.size.savedPercentage.average}%)`
            : 'TBD'
    },
    {
        label: 'CO2 saved',
        value: imagesStore.shouldGetOptimisedResult && imagesStore.statistics
            ? formatCO2Emissions(imagesStore.statistics.total.co2Saved.saved.total)
            : 'TBD',
        highlight: imagesStore.shouldGetOptimisedResult
    }
])
</script>
