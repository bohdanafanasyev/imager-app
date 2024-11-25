<template>
    <div>
        <div class='flex gap-4 mb-8'>
            <h4 class='gm-text-xl gm-text-strong'>
                Settings
            </h4>
        </div>

        <div class='gap-12 flex flex-col'>
            <div class='flex flex-col'>
                <ToggleInput
                    id='renameInput'
                    v-model='imageStore.renameOptions.enabled'
                    label='Rename'
                />

                <HeightTransition
                    :is-expanded='imageStore.renameOptions.enabled'
                >
                    <div class='flex flex-col'>
                        <Dropdown
                            id='renamePresetsDropdown'
                            v-model='imageStore.renameOptions.preset'
                            class='mt-6'
                            :options='presetOptions'
                            label='Preset'
                            @change='onRenameSettingsChange'
                        />
                        <Dropdown
                            v-show='imageStore.renameOptions.preset === RENAME_OPTIONS.tripDayOrganiser'
                            id='startingDayDropdown'
                            v-model='imageStore.renameOptions.startingDay'
                            class='mt-6'
                            :options='renameStartingDayOptions'
                            label='Starting day'
                            @change='onRenameSettingsChange'
                        />
                        <NumberInput
                            v-show='imageStore.renameOptions.preset === RENAME_OPTIONS.numericOrder'
                            id='use12hFormatCheckbox'
                            v-model='imageStore.renameOptions.startingIndex'
                            class='mt-6'
                            label='Starting index'
                            @change='onRenameSettingsChange'
                        />
                        <Checkbox
                            v-show='imageStore.renameOptions.preset !== RENAME_OPTIONS.numericOrder'
                            id='use12hFormatCheckbox'
                            v-model='imageStore.renameOptions.use12hFormat'
                            class='mt-6'
                            label='Use 12h format'
                            @change='onRenameSettingsChange'
                        />
                    </div>
                </HeightTransition>
            </div>

            <div class='flex flex-col'>
                <ToggleInput
                    id='optimiseInput'
                    v-model='imageStore.optimise'
                    label='Optimise size'
                    @change='onOptimiseChange'
                />

                <HeightTransition :is-expanded='imageStore.optimise'>
                    <Dropdown
                        id='qualityDropdown'
                        v-model='imageStore.quality'
                        class='mt-6'
                        :disabled='isOptimising'
                        :options='qualityOptions'
                        label='Preset'
                    />

                    <div class='flex flex-col gap-4 mt-6'>
                        <Dropdown
                            id='FormatDropdown'
                            v-model='imageStore.format'
                            :options='fileFormatOptions'
                            :disabled='isOptimising'
                            label='Output format'
                        />
                        <p
                            v-if='imageStore.format === SUPPORTED_ENCODER_IMAGE_FORMATS.avif'
                            class='gm-text-2xs italic  text-green-500'
                        >
                            AVIF optimisation takes longer than WebP, however it provides better compression rates.
                        </p>
                    </div>
                </HeightTransition>

                <Controls class='mt-8' />
            </div>
        </div>
    </div>
</template>

<script setup
        lang="ts"
>
import { QUALITY, RENAME_OPTIONS, SUPPORTED_ENCODER_IMAGE_FORMATS } from '~/values'

const imageStore = useImagesStore()

const onRenameSettingsChange = () => {
    imageStore.assignNewNames()
}

const isOptimising = computed(() => imageStore.isOptimising)

const presetOptions = [
    { label: 'Trip Day Organizer', value: RENAME_OPTIONS.tripDayOrganiser },
    { label: 'Full Date & Time', value: RENAME_OPTIONS.fullDateAndTime },
    { label: 'Numeric order', value: RENAME_OPTIONS.numericOrder }
]

const qualityOptions = [
    {
        label: 'High quality, small optimization',
        value: QUALITY.ninety
    },
    {
        label: 'Good quality, moderate optimization',
        value: QUALITY.eighty
    },
    {
        label: 'Balanced quality and optimization',
        value: QUALITY.seventy
    },
    {
        label: 'Decent quality, high optimization',
        value: QUALITY.sixty
    }
]

const renameStartingDayOptions = [
    { value: '1', label: 'Day 1' },
    ...Array.from({ length: 29 }, (_, i) => ({ value: String(i + 2), label: `Day ${i + 2}` }))
]

const fileFormatOptions = [
    { value: SUPPORTED_ENCODER_IMAGE_FORMATS.webp, label: 'WebP' },
    { value: SUPPORTED_ENCODER_IMAGE_FORMATS.avif, label: 'AVIF' }
]

const onOptimiseChange = (enabled: boolean) => {
    if (!enabled) {
        imageStore.isOptimising = false
    }
}
</script>
