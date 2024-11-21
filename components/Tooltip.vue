<template>
    <UPopover
        mode='hover'
        :disabled='disabled'
        :ui='{
            background: "",
            ring: "",
            rounded: "rounded-lg"
        }'
        class='flex'
    >
        <slot />

        <template #panel>
            <div class='glass-3d tint-3xdark h-full w-full flex items-center justify-center py-2 px-3 max-w-xs'>
                <span>{{ text }}</span>
            </div>
        </template>
    </UPopover>
</template>

<script setup
        lang="ts"
>
const props = defineProps<{
    text: string
    disabled: boolean
}>()
</script>

<style>
.nuxt-tooltip {
    .reset-text-overflow {
        overflow: visible;
        text-overflow: clip;
        white-space: normal;
    }
}
</style>
