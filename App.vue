<template>
    <div class='h-screen w-full flex items-center justify-center py-20 px-40 gradient-background'>
        <NuxtImg
            ref='backgroundImage'
            class='h-full w-full fixed z-0 transition-opacity object-cover'
            :class="{
                'opacity-0': !isImageLoaded
            }"
            sizes='100vw xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw 2xl:100vw'
            src='/img/backgrounds/1.avif'
            format='avif'
            @load='onImageLoad'
        />
        <div class='z-10 relative glass-3d tint-3xdark w-full h-full rounded-3xl flex'>
            <UploadZone />
            <div class='w-96 h-full separator border-gray-500 py-8 px-6 flex flex-col justify-between'>
                <Settings />
                <Statistics />
            </div>
        </div>
    </div>
</template>

<script setup
        lang="ts"
>
const mainStore = useMainStore()

const isImageLoaded = ref(false)

onMounted(() => {
    mainStore.isDebugMode = isDebugMode()
})

const onImageLoad = () => {
    isImageLoaded.value = true
}
</script>

<style>
.separator {
    border-inline-start: 1px solid hsla(0, 0%, 100%, .1);
}

.gradient-background {
    background: linear-gradient(to right,
    rgb(155, 177, 190) 0%,
    rgb(154, 176, 189) 10%,
    rgb(152, 174, 187) 20%,
    rgb(149, 172, 182) 30%,
    rgb(148, 168, 179) 40%,
    rgb(145, 165, 176) 50%,
    rgb(143, 161, 171) 60%,
    rgb(141, 158, 166) 70%,
    rgb(137, 154, 162) 80%,
    rgb(134, 151, 159) 90%);
}

.transition-opacity {
    transition: opacity 1.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}
</style>
