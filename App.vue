<template>
    <div class='h-screen w-full flex items-center justify-center py-20 px-40'>
        <NuxtImg
            class='h-full w-full object-cover fixed z-0'
            src='/img/backgrounds/1.avif'
        />
        <div class='z-10 relative glass-3d tint-3xdark w-full h-full rounded-3xl flex'>
            <UploadZone />
            <Controls />
        </div>
    </div>
</template>
