<template>
    <div class='h-screen w-full flex items-center justify-center py-20 px-40'>
        <NuxtImg
            class='h-full w-full object-cover fixed z-0'
            src='/img/backgrounds/6.jpeg'
        />
        <div class='z-10 relative glass-3d tint-3xdark w-full h-full rounded-3xl flex'>
            <UploadZone />
            <div class='w-96 h-full separator border-gray-500 py-8 px-6 flex flex-col justify-between'>
                <Settings />
                <Controls />
                <Statistics />
            </div>
        </div>
    </div>
</template>

<script setup
        lang="ts"
>
import Controls from '~/components/Controls.vue'

const mainStore = useMainStore()

onMounted(() => {
    mainStore.isDebugMode = isDebugMode()
})
</script>

<style>
.separator {
    border-inline-start: 1px solid hsla(0, 0%, 100%, .1);
}
</style>
