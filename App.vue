<template>
    <div
        class='h-full w-full flex items-center justify-center gradient-background relative
               lg:py-16 lg:px-28
               xl:py-16 xl:px-52'
    >
        <NuxtImg
            ref='backgroundImage'
            class='h-full w-full z-0 transition-opacity object-cover fixed inset-0 pointer-events-none'
            :class="{
                'opacity-0': !isImageLoaded
            }"
            sizes='100vw xs:100vw sm:100vw lg:100vw lg:100vw xl:100vw xxl:100vw 2xl:100vw'
            src='/img/backgrounds/1.avif'
            alt='Background image'
            format='avif'
            @load='onImageLoad'
        />
        <div
            class='z-10 relative glass-3d tint-3xdark w-full h-full flex flex-col
                   lg:flex-row lg:rounded-3xl
                   xl:max-w-screen-2xl '
        >
            <UploadZone />
            <ControlsBar v-if='!appStore.isDesktopUI' />

            <!-- In smaller viewports move the settings and statistics to the slide bar -->
            <SlideOver
                v-if='!appStore.isDesktopUI'
                :is-open='appStore.showMobileSlideOver'
                @close='appStore.showMobileSlideOver = false'
            >
                <Settings />
                <Statistics class='mt-8' />
            </SlideOver>

            <!-- In 1024+ inject settings and statistics as part of the application -->
            <div
                v-if='appStore.isDesktopUI'
                class='w-96 h-full separator-left border-gray-500 py-8 px-6 flex-col justify-between hidden lg:flex overflow-scroll'
            >
                <Settings />
                <Statistics class='mt-8' />
            </div>
        </div>
    </div>
</template>

<script setup
        lang="ts"
>
import { getUserSessionId } from '~/utils/user'
import { generateOptimisationAbortedLink } from '~/utils/analytics'

const appStore = useAppStore()
const imagesStore = useImagesStore()
const userStore = useUserStore()

const isImageLoaded = ref(false)

const isDesktopUI = () => window.innerWidth >= 1024 // 1024px == lg in tailwind

const debouncedDetectUIStyle = debounce(() => {
    appStore.isDesktopUI = isDesktopUI()
}, 0)

const prefillStores = () => {
    appStore.isDebugMode = isDebugMode()
    appStore.isDesktopUI = isDesktopUI()
    userStore.id = getUserId()
    userStore.sessionId = getUserSessionId()
    imagesStore.renameOptions.use12hFormat = is12HourFormat()
}

onMounted(() => {
    prefillStores()
    window.addEventListener('resize', debouncedDetectUIStyle)
})

const onImageLoad = () => {
    isImageLoaded.value = true
}
</script>

<style>
html, body, #app {
    height: 100%;
}

html {
    background-color: rgb(72, 88, 97);
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
    rgb(134, 151, 159) 100%);
}

.transition-opacity {
    transition: opacity 1.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}
</style>
