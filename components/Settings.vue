<template>
    <div>
        <div class='flex gap-4 mb-8'>
            <h4 class='text-xl font-sans text-strong'>
                Settings
            </h4>
        </div>

        <div class='gap-12 flex flex-col'>
            <div class='flex flex-col'>
                <ToggleInput
                    id='renameInput'
                    v-model='mainStore.rename'
                    label='Rename'
                />

                <HeightTransition
                    :is-expanded='mainStore.rename'
                >
                    <Dropdown
                        v-show='mainStore.rename'
                        id='startingDayDropdown'
                        v-model='mainStore.startingDay'
                        class='mt-6'
                        :options='renameStartingDayOptions'
                        label='Starting day'
                        @change='onStartingDayChange'
                    />
                </HeightTransition>
            </div>

            <div class='flex flex-col'>
                <ToggleInput
                    id='optimiseInput'
                    v-model='mainStore.optimise'
                    label='Optimise size'
                />

                <HeightTransition :is-expanded='mainStore.optimise'>
                    <Dropdown
                        id='qualityDropdown'
                        v-model='mainStore.quality'
                        class='mt-6'
                        :options='qualityOptions'
                        label='Preset'
                    />

                    <div class='flex flex-col gap-4 mt-6'>
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
                </HeightTransition>
            </div>
        </div>

        <!-- Controls -->
        <div class='flex mt-8'>
            <Button
                v-if='mainStore.optimise && !mainStore.allImagesOptimised'
                :class='{
                    ["pointer-events-none"]: mainStore.isOptimising || !mainStore.images.length
                }'
                :disabled='mainStore.isOptimising'
                @click='optimiseImages'
            >
                Optimise
            </Button>
            <Button
                v-if='(mainStore.optimise && mainStore.allImagesOptimised) || (mainStore.rename && !mainStore.optimise)'
                @click='downloadImages'
            >
                Download
            </Button>
        </div>
    </div>
</template>

<script setup
        lang="ts"
>
import { QUALITY, SUPPORTED_ENCODER_IMAGE_FORMATS } from '~/values'
import ToggleInput from '~/components/ToggleInput.vue'
import HeightTransition from '~/components/HeightTransition.vue'

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
