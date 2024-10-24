<template>
    <div class="w-full py-8 pl-8 pr-1 flex flex-col">
        <div class="flex gap-4 mb-8">
            <h4 class="text-xl font-sans text-strong">
                Files
            </h4>
            <label for="file-input"
                   class="btn-secondary btn-sm block">
            <span class="btn-text">
                +
            </span>
            </label>
            <input type="file"
                   id="file-input"
                   ref="fileInput"
                   class="hidden"
                   accept="image/png, image/jpeg, image/jpg, image/heic"
                   multiple
                   @change="onFileChange" />
        </div>

        <transition-group v-show="mainStore.files.length"
                          name="fade"
                          tag="ul"
                          class="flex flex-col gap-4 overflow-y-scroll flex-1 custom-scroll pr-7">
            <li v-for="(file, index) in mainStore.files"
                :key="file.name"
                :style="{ transitionDelay: `${index * 60}ms` }"
                class="flex gap-4">
                <div class="w-16 h-16 rounded-xl shadow-md overflow-clip">
                    <img v-if="file.url"
                         :src="file.url"
                         :alt="file.name"
                         class="w-full h-full object-cover" />
                    <div v-else
                         class="glass-3d tint-2xdark h-full w-full flex items-center justify-center">
                        <PhotoIcon class="w-6" />
                    </div>
                </div>
                <div class="flex flex-col gap-1 justify-center">
                    <p class="font-sans text-s">
                        {{ mainStore.rename ? file.newName : file.name }}
                    </p>
                    <p class="font-sans text-xs text-gray-400">
                        {{ formatFileSize(file.size) }}
                    </p>
                </div>
            </li>
        </transition-group>
        <p v-show="!mainStore.files.length"
           class="font-sans">Select the files by clicking the plus icon</p>
    </div>
</template>

<script setup
        lang="ts">
import { ref } from 'vue'
import ExifReader from 'exifreader'
import { filesize } from 'filesize'
import { compareAsc } from 'date-fns'
import PhotoIcon from '~/components/PhotoIcon.vue'
import { IMAGE_TYPES } from '~/values'

const fileInput = ref<HTMLInputElement | null>(null)
const mainStore = useMainStore()

const getDateFromExifDate = (exifDate) => {
    const [year, month, day, hour, minute, second] = exifDate.split(/\D/)
    return new Date(year, month - 1, day, hour, minute, second)
}

const formatFileSize = (size: number) => {
    return filesize(size)
}

const getImagesData = async (filesArray: Array<File>): Promise<void> => {
    await Promise.all(filesArray.map(async (file) => {
        let creationDate = new Date(file.lastModified);

        if (!creationDate) {
            const metadata = await ExifReader.load(file, {async: true});

            if (metadata.DateTimeOriginal) {
                try {
                    creationDate = getDateFromExifDate(metadata.DateTimeOriginal.value[0]);
                } catch (error) {
                    console.error('Error parsing EXIF date', error);
                }
            }
        }

        file.creationDate = creationDate;

        // HEIC files are not supported by the browsers, so don't try to show them
        if (file.type === IMAGE_TYPES.heic) {
            file.url = null;
        } else {
            file.url = URL.createObjectURL(file);
        }
    }));
};

const onFileChange = async (): Promise<void> => {
    if (fileInput.value?.files) {
        const filesArray = Array.from(fileInput.value.files)

        await getImagesData(filesArray)

        // Sort files by timestamp
        filesArray.sort((a, b) => compareAsc(a.creationDate, b.creationDate))
        mainStore.setFiles(filesArray)
    }
}


</script>

<style lang="scss"
       scoped>
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s, transform 0.5s;
}

.fade-enter-from, .fade-leave-to {
    opacity: 0;
    transform: translateY(5px);
}

.custom-scroll {
    scrollbar-width: thin;
    scrollbar-color: rgb(72, 70, 70, 0.8) transparent;
}
</style>