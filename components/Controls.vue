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
const imagesStore = useImagesStore()

const isDownloading = ref(false)
const isOptimisedOnce = ref(false)

const optimiseImages = async (): Promise<void> => {
    if (imagesStore.images.size) {
        imagesStore.optimiseOptions.isOptimising = true
        isOptimisedOnce.value = true

        trackOptimisationStarted()

        imagesStore.onReOptimise()

        for (const [key, image] of imagesStore.images) {
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

        trackOptimisationCompleted()
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

const onOptimisationStopClick = (): void => {
    imagesStore.optimiseOptions.isOptimising = false
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
