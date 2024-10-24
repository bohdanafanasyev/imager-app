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
                       tabindex="0"
                       id="s-0"
                       v-model="mainStore.rename">
            </div>

            <div class="gap-4 flex flex-col">
                <h5 class="text-l font-sans text-strong">
                    File staring date
                </h5>
                <div class="text-input-bg spotlight">
                    <select class="text-input"
                            id="t-1"
                            name="text-input"
                            :disabled="!mainStore.rename"
                            tabindex="0"
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
                       tabindex="0"
                       id="s-0"
                       v-model="mainStore.optimiseSize">
            </div>

            <div class="flex flex-col gap-4">
                <div class="flex text-xs place-items-center justify-between font-medium">
                    <span class="text-ital">Uploaded size</span>
                    <span>
                        {{ mainStore.totalFilesSize ? formatFileSize(mainStore.totalFilesSize) : "TBD" }}
                    </span>
                </div>
                <div class="flex text-xs place-items-center justify-between font-medium">
                    <span class="text-ital">Optimised size</span>
                    <span>
                        {{ mainStore.totalFilesSize ? formatFileSize(mainStore.optimisedFilesSize) : "TBD" }}
                    </span>
                </div>
                <div class="flex text-xs place-items-center justify-between font-medium">
                    <span class="text-ital">Saved size</span>
                    <span>
                        {{
                            mainStore.savedFilesSize ? `${ formatFileSize(mainStore.savedFilesSize) } (${ mainStore.savedFilesPercentage }%)` : "TBD"
                        }}
                    </span>
                </div>
            </div>

            <button class="btn-secondary btn-sm ml-auto"
                    @click="processImages">
                <span class="btn-text">Process</span>
            </button>
        </div>


        <!--        <button @click="downloadFile">-->
        <!--            <p>Download link</p>-->
        <!--        </button>-->
    </div>

</template>

<script setup
        lang="ts">
import { ref, onBeforeMount } from 'vue';
import { getUserToken } from '~/util';
import { filesize } from 'filesize'

const formatFileSize = (size: number) => {
    return filesize(size);
};

const availableForDownload = ref<boolean>(false);
const userToken = ref<string | null>(null);
const mainStore = useMainStore();

onBeforeMount(() => {
    userToken.value = getUserToken();
});

const onStartingDayChange = () => {
    mainStore.renameFiles();
};

const processImages = async (): Promise<void> => {
    const files = mainStore.files;

    if (!files || files.length === 0) return;

    const formData = new FormData();

    for (const file of files) {
        formData.append(
            'files',
            file,
            mainStore.rename ? file.newName : file.name
        );
    }

    const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
            'Authorization': `${ userToken.value }`
        },
        body: formData
    });

    const result = await response.json();

    if (result.success) {
        availableForDownload.value = true;
    }
};

const downloadFile = async (): Promise<void> => {
    const response = await fetch('/api/download', {
        headers: {
            'Authorization': `${ userToken.value }`
        }
    });
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'download.zip';
    a.click();
    URL.revokeObjectURL(url);
};
</script>


<style>
.separator {
    border-inline-start: 1px solid hsla(0, 0%, 100%, .1);
}
</style>