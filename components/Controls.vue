<template>
    <div class="w-96 h-full separator border-gray-500 p-8">
        <div class="flex gap-4 mb-8">
            <h4 class="text-xl font-sans text-strong">
                Process
            </h4>
        </div>

        <div class="gap-8 flex flex-col">
            <div class="input-group flex justify-between">
                <label class="text-l font-sans text-strong">
                    Rename
                </label>

                <input class="switch"
                       type="checkbox"
                       v-model="mainStore.rename">
            </div>

            <div class="gap-4 flex flex-col">
                <h5 class="text-l font-sans text-strong">
                    File staring date
                </h5>
                <div class="text-input-bg spotlight">
                    <select class="text-input"
                            name="text-input"
                            :disabled="!mainStore.rename"
                            v-model="mainStore.startingDate"
                            @change="onStartingDayChange">
                        <option selected
                                value="1">
                            Day 1
                        </option>
                        <option v-for="i in 29"
                                :key="i + 1"
                                :value="i + 1">
                            Day {{ i + 1 }}
                        </option>
                    </select>
                </div>
            </div>

            <div class="input-group flex justify-between">
                <label class="text-l font-sans text-strong">
                    Optimise size
                </label>


                <input class="switch"
                       type="checkbox"
                       v-model="mainStore.optimiseSize">
            </div>

            <div class="flex flex-col gap-4">
                <div class="flex text-xs place-items-center justify-between font-medium">
                    <span class="text-ital">Uploaded size</span>
                    <span>
                        {{ mainStore.totalFilesSize ? filesize(mainStore.totalFilesSize) : "TBD" }}
                    </span>
                </div>
                <div class="flex text-xs place-items-center justify-between font-medium">
                    <span class="text-ital">Optimised size</span>
                    <span>
                        {{ mainStore.optimisedFilesSize > 0 ? filesize(mainStore.optimisedFilesSize) : "TBD" }}
                    </span>
                </div>
                <div class="flex text-xs place-items-center justify-between font-medium">
                    <span class="text-ital">Saved size</span>
                    <span>
                        {{
                            mainStore.savedFilesSize > 0 ? `${ filesize(mainStore.savedFilesSize) } (${ mainStore.savedFilesPercentage }%)` : "TBD"
                        }}
                    </span>
                </div>
            </div>

            <div class="flex">
                <button class="btn-secondary btn-sm ml-auto"
                        @click="processImages">
                    <span class="btn-text">Process</span>
                </button>
                <button v-if="mainStore.allImagesProcessed"
                        class="btn-secondary btn-sm ml-auto"
                        @click="downloadImages">
                    <span class="btn-text">Download</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup
        lang="ts">
import { filesize } from 'filesize'
import { IMAGE_TYPES } from '~/values'

const mainStore = useMainStore();

const onStartingDayChange = () => {
    mainStore.assignNewNames();
};

const processImages = async (): Promise<void> => {
    if (mainStore.images.length) {
        mainStore.processing = true;

        for (const image of mainStore.images) {
            image.processedFile = await processImage(image);
        }
    }

    mainStore.processing = false;
};

const downloadImages = async (): Promise<void> => {
    const images = mainStore.images;

    for (let index = 0; index < images.length; index++) {
        const image = images[index];

        if (image) {
            const processedFile = image.processedFile;

            if (processedFile) {
                const blob = new Blob([processedFile], {type: IMAGE_TYPES.webp});
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${ image.newName }.webp`;
                a.click();
                URL.revokeObjectURL(url);
            }
        }
    }
};
</script>


<style>
.separator {
    border-inline-start: 1px solid hsla(0, 0%, 100%, .1);
}
</style>