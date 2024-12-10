<template>
    <div class='flex'>
        <Button
            v-if='showOptimiseButton'
            @click='optimiseImages'
        >
            {{ imagesStore.optimisationSettingsChanged && isOptimisedOnce ? 'Re-optimise' : 'Optimise' }}
        </Button>
        <Button
            v-if='imagesStore.optimiseOptions.isOptimising'
            @click='onOptimisationPauseClick'
        >
            Pause
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
const imagesStore = useImagesStore()

const isDownloading = ref(false)
const isOptimisedOnce = ref(false)

const optimiseImages = async (): Promise<void> => {
    if (imagesStore.images.size) {
        if (imagesStore.optimiseOptions.isPaused) {
            trackOptimisationResumed(imagesStore.images.size)
        }
        else {
            trackOptimisationStarted(imagesStore.images.size)
        }

        onOptimise()

        for (const [key, image] of imagesStore.images) {
            // Check if optimisation is still enabled (it might have been stopped
            if (!imagesStore.optimiseOptions.isOptimising) {
                break
            }

            if (!imagesStore.images.has(key) || image.optimisationResult) {
                continue
            }

            const result = await optimiseImage(image, Number(imagesStore.optimiseOptions.quality), imagesStore.optimiseOptions.format)

            if (imagesStore.optimiseOptions.isOptimising && imagesStore.images.has(key)) {
                image.optimisationResult = result
                image.format.optimised = imagesStore.optimiseOptions.format
            }
        }

        if (!imagesStore.optimiseOptions.isPaused) {
            imagesStore.getOptimisationStatistics()
            trackOptimisationCompleted(imagesStore.statistics)
        }
    }

    imagesStore.optimiseOptions.isOptimising = false
}

const downloadImages = async () => {
    isDownloading.value = true

    await downloadFiles(
        imagesStore.images,
        imagesStore.renameOptions.enabled,
        imagesStore.optimiseOptions.enabled,
        imagesStore.optimiseOptions.format
    )

    setTimeout(() => {
        isDownloading.value = false
        trackDownloadCompleted()
    })
}

const onOptimise = () => {
    isOptimisedOnce.value = true
    imagesStore.optimiseOptions.isOptimising = true
    imagesStore.optimiseOptions.isPaused = false
    imagesStore.statistics = null

    if (imagesStore.optimisationSettingsChanged) {
        imagesStore.optimiseOptions.lastSettings = {
            quality: imagesStore.optimiseOptions.quality,
            format: imagesStore.optimiseOptions.format
        }

        imagesStore.images.forEach((image) => image.optimisationResult = null)
    }
}

const onOptimisationPauseClick = (): void => {
    imagesStore.optimiseOptions.isOptimising = false
    imagesStore.optimiseOptions.isPaused = true

    trackOptimisationPaused()
}

const showOptimiseButton = computed(() => {
    let show = false

    if (imagesStore.optimiseOptions.enabled) {
        if (!imagesStore.optimiseOptions.isOptimising && !imagesStore.allImagesOptimised) {
            show = true
        }

        if (imagesStore.optimisationSettingsChanged) {
            show = true
        }
    }

    return show
})

const showDownloadButton = computed(() => {
    let show = false

    if (imagesStore.optimiseOptions.enabled) {
        if (imagesStore.allImagesOptimised) {
            show = !imagesStore.optimisationSettingsChanged
        }
    }
    else if (imagesStore.renameOptions.enabled) {
        show = true
    }

    return show
})
</script>
