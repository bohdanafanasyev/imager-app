<template>
    <fieldset class='flex flex-col gap-3'>
        <label
            :for='id'
            class='text-xs font-sans text-strong'
        >
            {{ label }}
        </label>
        <div class='text-input-bg spotlight'>
            <select
                :id='id'
                :value='modelValue'
                class='text-input truncate'
                @change='onChange'
            >
                <option
                    v-for='option in options'
                    :key='option.value'
                    :selected='option.value === modelValue'
                    :value='option.value'
                >
                    {{ option.label }}
                </option>
            </select>
        </div>
    </fieldset>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { defineProps } from 'vue'
import { EMIT_EVENTS } from '~/values/events'

type Option = {
    label: string
    value: string
}

const props = defineProps({
    label: String,
    id: String,
    modelValue: String,
    options: {
        type: Array as PropType<Option[]>,
        required: true
    }
})

const emit = defineEmits([EMIT_EVENTS.updateModelValue, EMIT_EVENTS.change])

const onChange = (event: Event) => {
    const { value } = event.target as HTMLSelectElement

    emit(EMIT_EVENTS.updateModelValue, value)
    emit(EMIT_EVENTS.change, value)
}
</script>
