<!-- components/InputGroup.vue -->
<template>
    <fieldset class='input-group flex justify-between'>
        <label
            :for='id'
            class='gm-text-xs flex items-center'
        >
            {{ label }}
        </label>

        <input
            :id='id'
            :value='modelValue'
            class='checkbox'
            type='checkbox'
            :checked='modelValue'
            @change='updateValue(!modelValue)'
        >
    </fieldset>
</template>

<script setup lang="ts">
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
