<template>
    <div
        class='h-screen w-full flex items-center justify-center py-5 px-5 gradient-background relative
               sm:py-10 sm:px-20
               md:px-15 md:py-30
               lg:px-20 lg:py-20
               xl:py-20 xl:px-40'
    >
        <NuxtImg
            ref='backgroundImage'
            class='h-full w-full fixed z-0 transition-opacity object-cover'
            :class="{
                'opacity-0': !isImageLoaded
            }"
            sizes='100vw xs:100vw sm:100vw lg:100vw lg:100vw xl:100vw xxl:100vw 2xl:100vw'
            src='/img/backgrounds/1.avif'
            format='avif'
            @load='onImageLoad'
        />
        <div
            class='z-10 relative glass-3d tint-3xdark w-full h-full rounded-3xl flex flex-col
                   lg:flex-row
                   xl:max-w-screen-2xl'
        >
            <UploadZone />
            <ControlsBar class='lg:hidden' />

            <!-- In smaller viewports move the settings and statistics to the slide bar -->
            <SlideOver
                :is-open='mainStore.showMobileSlideOver'
                @close='mainStore.showMobileSlideOver = false'
            >
                <Settings />
                <Statistics />
            </SlideOver>

            <!-- In 1024+ inject settings and statistics as part of the application -->
            <div class='w-96 h-full separator-left border-gray-500 py-8 px-6 flex-col justify-between hidden lg:flex'>
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
* {
    scrollbar-width: thin;
    scrollbar-color: rgb(72, 70, 70, 0.8) transparent;
}

.separator-left {
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
