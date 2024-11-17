<template>
    <div class='flex mt-8'>
        <Button
            v-if='mainStore.optimise && !mainStore.allImagesOptimised'
            :class='{
                ["pointer-events-none"]: mainStore.isOptimising || !mainStore.images.length
            }'
            :disabled='mainStore.isOptimising'
            @click='optimiseImages'
        >
            Optimise
        </Button>
        <Button
            v-if='(mainStore.optimise && mainStore.allImagesOptimised) || (mainStore.rename && !mainStore.optimise)'
            @click='downloadImages'
        >
            Download
        </Button>
    </div>
</template>

<script setup
        lang="ts"
>
const mainStore = useMainStore()

const optimiseImages = async (): Promise<void> => {
    if (mainStore.images.length) {
        mainStore.isOptimising = true

        for (const image of mainStore.images) {
            image.optimisationResult = await optimiseImage(image, Number(mainStore.quality), mainStore.outputFormat)
            image.format.optimised = image.optimisationResult.encoderFormat
        }
    }

    mainStore.isOptimising = false
}

const downloadImages = (): void => {
    downloadFiles(mainStore.images, mainStore.rename, mainStore.optimise)
}
</script>

<style scoped>

</style>
