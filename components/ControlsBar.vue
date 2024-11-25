<template>
    <div
        class='w-full h-16 mt-auto separator-top flex gap-4 px-8 items-center justify-end shrink-0
               sm:h-20'
    >
        <Controls />
    </div>
</template>

<script setup
        lang="ts"
        >
const imagesStore = useImagesStore()
</script>

<style scoped>
.separator-top {
    border-block-start: 1px solid hsla(0, 0%, 100%, .1);
}
</style>
