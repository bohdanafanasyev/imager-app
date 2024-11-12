<template>
    <div>
        <div class='flex gap-4 mb-8'>
            <h4 class='text-xl font-sans text-strong'>
                Settings
            </h4>
        </div>

        <div class='gap-12 flex flex-col'>
            <div class='flex flex-col gap-6'>
                <ToggleInput
                    id='renameInput'
                    v-model='mainStore.rename'
                    label='Rename'
                />

                <Dropdown
                    v-if='mainStore.rename'
                    id='startingDayDropdown'
                    v-model='mainStore.startingDay'
                    :options='renameStartingDayOptions'
                    label='Starting day'
                    @change='onStartingDayChange'
                />
            </div>

            <div class='flex flex-col gap-6'>
                <ToggleInput
                    id='optimiseInput'
                    v-model='mainStore.optimise'
                    label='Optimise size'
                />

                <template v-if='mainStore.optimise'>
                    <Dropdown
                        id='qualityDropdown'
                        v-model='mainStore.quality'
                        :options='qualityOptions'
                        label='Preset'
                    />

                    <div class='flex flex-col gap-4'>
                        <Dropdown
                            id='outputFormatDropdown'
                            v-model='mainStore.outputFormat'
                            :options='fileOutputFormatOptions'
                            label='Output format'
                        />
                        <p
                            v-if='mainStore.outputFormat === SUPPORTED_ENCODER_IMAGE_FORMATS.avif'
                            class='text-2xs italic font-sans text-green-500'
                        >
                            AVIF optimisation takes longer than WebP, however it provides better compression rates.
                        </p>
                    </div>
                </template>
            </div>
        </div>

        <!-- Controls -->
        <div class='flex mt-8'>
            <button
                v-if='mainStore.optimise && !mainStore.allImagesOptimised'
                class='btn-secondary btn-sm ml-auto'
                :class='{
                    ["pointer-events-none"]: mainStore.isOptimising || !mainStore.images.length
                }'
                :disabled='mainStore.isOptimising'
                @click='optimiseImages'
            >
                <span class='btn-text'>Optimise</span>
            </button>
            <button
                v-if='mainStore.allImagesOptimised || !mainStore.optimise'
                class='btn-secondary btn-sm ml-auto'
                @click='downloadImages'
            >
                <span class='btn-text'>Download</span>
            </button>
        </div>
    </div>
</template>

<script setup
        lang="ts"
>
import { QUALITY, SUPPORTED_ENCODER_IMAGE_FORMATS } from '~/values'
import ToggleInput from '~/components/ToggleInput.vue'

const mainStore = useMainStore()

const onStartingDayChange = () => {
    mainStore.assignNewNames()
}

const optimiseImages = async (): Promise<void> => {
    if (mainStore.images.length) {
        mainStore.isOptimising = true

        for (const image of mainStore.images) {
            image.optimisationResult = await optimiseImage(image, Number(mainStore.quality), mainStore.outputFormat)
            image.format.optimised = image.optimisationResult.encoderFormat
        }
    }

    mainStore.isOptimising = false
}

const downloadImages = (): void => {
    downloadFiles(mainStore.images, mainStore.rename, mainStore.optimise)
}

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

const fileOutputFormatOptions = [
    { value: SUPPORTED_ENCODER_IMAGE_FORMATS.webp, label: 'WebP' },
    { value: SUPPORTED_ENCODER_IMAGE_FORMATS.avif, label: 'AVIF' }
]
</script>
