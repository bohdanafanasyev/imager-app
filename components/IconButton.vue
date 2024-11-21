<template>
    <component
        :is='tag'
        class='btn-secondary btn-icon-sm'
    >
        <span class='z-20'>

            <slot />
        </span>
    </component>
</template>

<script setup lang="ts">
const props = defineProps({
    tag: {
        type: String,
        default: 'button'
    }
})
</script>
