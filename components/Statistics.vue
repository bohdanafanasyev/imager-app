<template>
    <div class='flex flex-col gap-6'>
        <h5 class='text-sm font-sans text-strong'>
            Stats
        </h5>
        <div class='flex flex-col gap-4'>
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
    </div>
</template>

<script setup
        lang="ts"
>
import { computed } from 'vue'
import { filesize } from 'filesize'
import { formatCO2Emissions } from '~/utils/co2Emissions'

const mainStore = useMainStore()

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
