<template>
    <div
        ref='content'
        :class="{
            'content-expanded': isExpanded
        }"
        class='content'
        @transitionend='onTransitionEnd'
    >
        <slot />
    </div>
</template>

<script setup
        lang="ts"
>
import { ref, watch } from 'vue'

const heightValues = {
    auto: 'auto',
    zero: '0px'
}
const props = defineProps<{ isExpanded: boolean }>()
const content = ref<HTMLElement | null>(null)
const height = ref(heightValues.zero)

if (props.isExpanded) {
    height.value = heightValues.auto
}

const setContentHeight = () => {
    if (content.value) {
        height.value = `${content.value.scrollHeight ?? content.value.clientHeight}px`
    }
}

watch(() => props.isExpanded, () => {
    if (!props.isExpanded) {
        setContentHeight()

        requestAnimationFrame(() => {
            height.value = heightValues.zero
        })
    }
    else {
        setContentHeight()
    }
})

const onTransitionEnd = () => {
    if (props.isExpanded) {
        height.value = heightValues.auto
    }
}
</script>

<style scoped>
.content {
    /* Transition copied from glass3d rules */
    transition: opacity 400ms cubic-bezier(0.46, 0.43, 0.1, 0.99), height 600ms cubic-bezier(0.46, 0.43, 0.1, 0.99);
    height: v-bind(height);
    opacity: 0;
    overflow: hidden;
}

.content-expanded {
    opacity: 1;
}
</style>
