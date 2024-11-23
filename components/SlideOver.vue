<template>
    <USlideover
        :model-value='isOpen'
        :appear='true'
        :ui='overlayUI'
    >
        <div class='p-6 flex-1 relative overflow-auto'>
            <button
                class='flex absolute end-2 top-4 z-10 p-3'
                @click='onClose'
            >
                <NuxtImg
                    class='flex items-center justify-center relative w-5'
                    src='/icons/close.svg'
                />
            </button>
            <slot />
        </div>
    </USlideover>
</template>

<script setup
        lang="ts"
>
import { EMIT_EVENTS } from '~/values/events'

const emit = defineEmits([EMIT_EVENTS.close])

const props = defineProps<{
    isOpen: boolean
}>()

const onClose = () => {
    emit(EMIT_EVENTS.close)
}

const overlayUI = ref({
    wrapper: 'fixed inset-0 flex z-50',
    overlay: {
        base: 'fixed inset-0 transition-opacity',
        background: 'bg-stone-200/75 dark:bg-neutral-800/50',
        transition: {
            enter: 'ease-in-out duration-500',
            enterFrom: 'opacity-0',
            enterTo: 'opacity-100',
            leave: 'ease-in-out duration-500',
            leaveFrom: 'opacity-100',
            leaveTo: 'opacity-0'
        }
    },
    base: 'relative flex-1 flex flex-col w-full focus:outline-none',
    background: 'bg-white-none dark:bg-gray-none glass-3d tint-dark',
    ring: '',
    rounded: '',
    padding: '',
    shadow: 'shadow-xl',
    width: 'w-screen max-w-md',
    height: 'h-screen max-h-96',
    translate: {
        base: 'translate-x-0',
        left: '-translate-x-full rtl:translate-x-full',
        right: 'translate-x-full rtl:-translate-x-full',
        top: '-translate-y-full',
        bottom: 'translate-y-full'
    },
    transition: {
        enter: 'transform transition ease-in-out duration-300',
        leave: 'transform transition ease-in-out duration-200'
    }
})
</script>
