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
                class='text-input'
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

const emit = defineEmits(['update:modelValue', 'change'])

const onChange = (event: Event) => {
    const target = event.target as HTMLSelectElement
    emit('update:modelValue', target.value)
    emit('change')
}
</script>
