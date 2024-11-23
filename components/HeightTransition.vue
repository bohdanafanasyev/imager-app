<template>
    <div
        ref='content'
        :class="{
            'content-expanded': isExpanded,
            'content-initialLoad': initialLoad
        }"
        class='content'
    >
        <slot />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { debounce } from '~/utils/debounce'

const props = defineProps<{ isExpanded: boolean }>()
const content = ref<HTMLElement | null>(null)
const initialLoad = ref(true)
const height = ref('0px')

const recalculateHeight = () => {
    if (content.value) {
        height.value = `${content.value.scrollHeight ?? content.value.clientHeight}px`
    }
}

const debouncedRecalculateHeight = debounce(recalculateHeight, 200)

onMounted(() => {
    recalculateHeight()
    window.addEventListener('resize', debouncedRecalculateHeight)

    setTimeout(() => {
        initialLoad.value = false
    })
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', debouncedRecalculateHeight)
})
</script>

<style scoped>
.content {
    /* Transition copied from glass3d rules */
    transition: opacity 400ms cubic-bezier(0.46, 0.43, 0.1, 0.99), height 600ms cubic-bezier(0.46, 0.43, 0.1, 0.99);
    opacity: 0;
    height: 0;
    overflow: hidden;
}

.content-expanded {
    opacity: 1;
    height: v-bind(height);
}

.content-initialLoad {
    transition: none;
    height: auto;
    overflow: auto;
}
</style>
