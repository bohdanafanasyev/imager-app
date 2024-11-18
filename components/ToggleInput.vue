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
import { EMIT_EVENTS } from '~/values/events'

const props = defineProps({
    id: String,
    label: String,
    modelValue: Boolean
})

const emit = defineEmits([EMIT_EVENTS.updateModelValue, EMIT_EVENTS.change])

const updateValue = (value: boolean) => {
    emit(EMIT_EVENTS.updateModelValue, value)
    emit(EMIT_EVENTS.change, value)
}
</script>
