<template>
    <div class='h-screen w-full flex items-center justify-center py-20 px-40'>
        <NuxtImg
            class='h-full w-full object-cover fixed z-0'
            src='/img/backgrounds/1.jpeg'
        />
        <div class='z-10 relative glass-3d tint-3xdark w-full h-full rounded-3xl flex'>
            <UploadZone />
            <div class='w-96 h-full separator border-gray-500 p-8 flex flex-col justify-between'>
                <Settings />
                <Statistics />
            </div>
        </div>
    </div>
</template>

<style>
.separator {
    border-inline-start: 1px solid hsla(0, 0%, 100%, .1);
}
</style>
