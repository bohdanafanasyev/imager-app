<template>
    <div class='flex'>
        <Button
            v-if='showOptimiseButton'
            @click='optimiseImages'
        >
            {{ imageStore.optimisationSettingsChanged && isOptimisedOnce ? 'Re-optimise' : 'Optimise' }}
        </Button>
        <Button
            v-if='imageStore.isOptimising'
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
const imageStore = useImagesStore()

const isDownloading = ref(false)
const isOptimisedOnce = ref(false)

const optimiseImages = async (): Promise<void> => {
    if (imageStore.images.size) {
        imageStore.isOptimising = true
        isOptimisedOnce.value = true

        imageStore.onReOptimise()

        for (const [key, image] of imageStore.images) {
            if (!imageStore.isOptimising) {
                break
            }

            if (!imageStore.images.has(key) || image.optimisationResult) {
                continue
            }

            const result = await optimiseImage(image, Number(imageStore.quality), imageStore.format)

            if (imageStore.isOptimising && imageStore.images.has(key)) {
                image.optimisationResult = result
                image.format.optimised = image.optimisationResult.encoderFormat
            }
        }
    }

    imageStore.isOptimising = false
}

const downloadImages = async () => {
    isDownloading.value = true
    await downloadFiles(imageStore.images, imageStore.renameOptions.enabled, imageStore.optimise)

    setTimeout(() => {
        isDownloading.value = false
    })
}

const onOptimisationStopClick = (): void => {
    imageStore.isOptimising = false
}

const showOptimiseButton = computed(() => {
    let show = false

    if (imageStore.optimise) {
        if (!imageStore.isOptimising && !imageStore.allImagesOptimised) {
            show = true
        }

        if (imageStore.optimisationSettingsChanged) {
            show = true
        }
    }

    return show
})

const showDownloadButton = computed(() => {
    let show = false

    if (imageStore.optimise) {
        if (imageStore.allImagesOptimised) {
            show = !imageStore.optimisationSettingsChanged
        }
    }
    else if (imageStore.renameOptions.enabled) {
        show = true
    }

    return show
})
</script>
