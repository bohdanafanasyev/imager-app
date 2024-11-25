<!-- components/InputGroup.vue -->
<template>
    <fieldset class='input-group flex flex-col justify-between relative gap-3'>
        <label
            :for='id'
            class='gm-text-xs flex items-center'
        >
            {{ label }}
        </label>

        <div class='text-input-bg spotlight'>
            <input
                :id='id'
                :value='modelValue'
                class='text-input'
                type='number'
                :placeholder='placeholder'
                @input='onInput'
                @keydown='preventInvalidInput'
            >
        </div>
    </fieldset>
</template>

<script setup lang="ts">
import { EMIT_EVENTS } from '~/values/events'

const props = defineProps({
    id: String,
    label: String,
    placeholder: String,
    modelValue: Number
})

const emit = defineEmits([EMIT_EVENTS.updateModelValue, EMIT_EVENTS.input])

const updateValue = (value: number) => {
    emit(EMIT_EVENTS.updateModelValue, value)
    emit(EMIT_EVENTS.input, value)
}

const onInput = (event: Event) => {
    const target = event.target as HTMLInputElement | null

    if (target) {
        updateValue(Number(target.value))
    }
}

const preventInvalidInput = (event: KeyboardEvent) => {
    if (event.key === 'e' || event.key === 'E' || event.key === '+' || event.key === '-') {
        event.preventDefault()
    }
}
</script>
