<template>
    <div class='flex mt-8'>
        <Button
            v-if='showOptimiseButton'
            @click='optimiseImages'
        >
            {{ mainStore.optimisationSettingsChanged && isOptimisedOnce ? 'Re-optimise' : 'Optimise' }}
        </Button>
        <Button
            v-if='mainStore.isOptimising'
            @click='onOptimisationStopClick'
        >
            Stop
        </Button>

        <Button
            v-if='showDownloadButton'
            :disabled='isDownloading'
            @click='downloadImages'
        >
            {{ isDownloading ? 'Preparing archive...' : 'Download' }}
        </Button>
    </div>
</template>

<script setup
        lang="ts"
>
const mainStore = useMainStore()

const isDownloading = ref(false)
const isOptimisedOnce = ref(false)

const optimiseImages = async (): Promise<void> => {
    if (mainStore.images.size) {
        mainStore.isOptimising = true
        isOptimisedOnce.value = true

        mainStore.onReOptimise()

        for (const [key, image] of mainStore.images) {
            if (!mainStore.isOptimising) {
                break
            }

            if (!mainStore.images.has(key) || image.optimisationResult) {
                continue
            }

            const result = await optimiseImage(image, Number(mainStore.quality), mainStore.outputFormat)

            if (mainStore.isOptimising && mainStore.images.has(key)) {
                image.optimisationResult = result
                image.format.optimised = image.optimisationResult.encoderFormat
            }
        }
    }

    mainStore.isOptimising = false
}

const downloadImages = async () => {
    isDownloading.value = true
    await downloadFiles(mainStore.images, mainStore.rename, mainStore.optimise)

    setTimeout(() => {
        isDownloading.value = false
    })
}

const onOptimisationStopClick = (): void => {
    mainStore.isOptimising = false
}

const showOptimiseButton = computed(() => {
    let show = false

    if (mainStore.optimise) {
        if (!mainStore.isOptimising && !mainStore.allImagesOptimised) {
            show = true
        }

        if (mainStore.optimisationSettingsChanged) {
            show = true
        }
    }

    return show
})

const showDownloadButton = computed(() => {
    let show = false

    if (mainStore.optimise) {
        if (mainStore.allImagesOptimised) {
            show = !mainStore.optimisationSettingsChanged
        }
    }
    else if (mainStore.rename) {
        show = true
    }

    return show
})
</script>
