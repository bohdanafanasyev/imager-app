<template>
    <li class='flex gap-4 group last:mb-8'>
        <!-- Thumbnail image -->
        <Tooltip
            :disabled='tooltipDisabled'
            :text='tooltipMessage'
        >
            <div
                class='w-14 h-14 rounded-xl shadow-md overflow-clip relative
                       sm:w-18 sm:h-18'
            >
                <div
                    v-if='isLoading || failedOptimisation'
                    class='tint-3xdark z-10 absolute inset-0 w-full h-full grid place-items-center'
                >
                    <div
                        v-if='isLoading'
                        class='spinner'
                    />
                    <NuxtImg
                        v-else
                        class='w-[20px] h-[20px] flex items-center justify-center relative'
                        src='/icons/warning.svg'
                    />
                </div>

                <div
                    v-if='thumbnailLoadError'
                    class='glass-3d tint-2xdark h-full w-full flex items-center justify-center'
                >
                    <NuxtImg
                        class='w-6 pointer-events-none'
                        src='/icons/image.svg'
                    />
                </div>
                <img
                    v-else
                    :src='image.thumbnail.url'
                    :alt='image.file.name'
                    class='w-full h-full object-cover z-100'
                    @error.once='onImageError(image)'
                >
            </div>
        </Tooltip>

        <!-- Title and stats -->
        <div class='flex flex-col gap-1 justify-center'>
            <p class=' gm-text-s'>
                {{ imagesStore.renameOptions.enabled ? image.newName : image.file.name }}
            </p>
            <div class='flex gap-1'>
                <p class=' gm-text-xs text-gray-400 flex gap-1'>
                    {{ filesize(image.file.size) }}
                    <template v-if='!imagesStore.optimisationSettingsChanged && imagesStore.optimiseOptions.enabled && image.optimisationResult?.arrayBuffer?.byteLength'>
                        <span>→</span>
                        <span class='text-green-500'>
                            {{ filesize(image.optimisationResult.arrayBuffer.byteLength) }}
                        </span>
                        <span
                            v-if='appStore.isDebugMode'
                            class='text-gray-300'
                        >
                            [decoding: {{ image.optimisationResult.performance.decoding }}s /
                            encoding: {{ image.optimisationResult.performance.encoding }}s /
                            total: {{ image.optimisationResult.performance.total }}s]
                        </span>
                    </template>
                </p>
            </div>
        </div>

        <!-- Controls -->
        <div class='flex items-center opacity-0 transition-opacity group-hover:opacity-100 ml-auto'>
            <button
                class='font-medium gm-text-xs text-gray-300 fill-icon hover:fill-red-400 p-3 transition-colors'
                @click='imagesStore.removeImage(storeKey)'
            >
                <DeleteIcon class='w-4' />
            </button>
        </div>
    </li>
</template>

<script setup
        lang="ts"
>
import { filesize } from 'filesize'
import type { Image } from '~/types'
import DeleteIcon from '~/components/icons/DeleteIcon.vue'

const props = defineProps<{
    image: Image
    storeKey: string
}>()

const imagesStore = useImagesStore()
const appStore = useAppStore()

const isLoading = computed(() => {
    return imagesStore.optimiseOptions.isOptimising && !props.image.optimisationResult
})

const failedOptimisation = computed(() => {
    return props.image.optimisationResult && !props.image.optimisationResult.arrayBuffer
})

const thumbnailLoadError = computed(() => {
    return props.image.thumbnail.loadError
})

const tooltipDisabled = computed(() => {
    return !(failedOptimisation.value || thumbnailLoadError.value)
})

const tooltipMessage = computed(() => {
    return failedOptimisation.value
        ? 'We are sorry this image couldn\'t be optimised due to an error during decoding or encoding, please try a different image if possible'
        : 'Image couldn\'t be displayed by the browser'
})

// Some images may not be displayed because browsers don't support their format (e.g. HEIC, sometimes AVIF)
const onImageError = (image: Image): void => {
    image.thumbnail.loadError = true
}
</script>

<style scoped>
.spinner {
    width: 20px;
    height: 20px;

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
