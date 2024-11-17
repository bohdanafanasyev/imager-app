<!-- components/InputGroup.vue -->
<template>
    <fieldset class='input-group flex justify-between'>
        <label
            :for='id'
            class='text-sm font-sans text-strong'
        >
            {{ label }}
        </label>

        <input
            :id='id'
            :value='modelValue'
            class='switch'
            type='checkbox'
            :checked='modelValue'
            @change='updateValue(!modelValue)'
        >
    </fieldset>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
    id: String,
    label: String,
    modelValue: Boolean
})

const emit = defineEmits(['update:modelValue', 'change'])

const updateValue = (value: boolean) => {
    emit('update:modelValue', value)
    emit('change', value)
}
</script>
