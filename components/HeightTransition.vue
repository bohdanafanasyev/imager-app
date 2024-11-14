<template>
    <transition name='expand'>
        <div
            v-show='isExpanded'
            ref='content'
            class='content'
        >
            <slot />
        </div>
    </transition>
</template>

<script setup
        lang="ts"
>
defineProps<{ isExpanded: boolean }>()
const content = ref()
const height = ref()

onMounted(() => {
    height.value = `${content.value.getBoundingClientRect().height}px`
})
</script>

<style scoped>
.expand-leave-active,
.expand-enter-active {
    /* Transition copied from glass3d rules */
    transition: opacity 400ms cubic-bezier(0.46, 0.43, 0.1, 0.99), height 600ms cubic-bezier(0.46, 0.43, 0.1, 0.99);
    overflow: hidden;
}

.expand-enter-to,
.expand-leave-from {
    height: v-bind(height);
    opacity: 1;
}

.expand-enter-from,
.expand-leave-to {
    opacity: 0;
    height: 0;
}
</style>
