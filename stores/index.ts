import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
    state: () => ({
        rename: true,
        startingDate: 1,
        optimiseSize: true,
        processing: false,
        images: []
    }),
    actions: {
        setImages (images: File[]) {
            this.images = images.map(file => {
                return {
                    file,
                    newName: '',
                    processedFile: null,
                    imageCantBeDisplayed: false
                }
            })

            this.assignNewNames()
        },
        assignNewNames () {
            assignNewNames(this.images, this.startingDate)
        }
    },
    getters: {
        totalFilesSize () {
            return this.images.reduce((acc, file) => acc + file.file.size, 0)
        },
        optimisedFilesSize () {
            return this.images.reduce((acc, file) => {
                if (file.processedFile) {
                    return acc + file.processedFile.byteLength;
                }

                return acc;
            }, 0);
        },
        savedFilesSize () {
            if (this.optimisedFilesSize) {
                return this.totalFilesSize - this.optimisedFilesSize;
            }

            return 0;

        },
        savedFilesPercentage () {
            return Number((this.savedFilesSize / this.totalFilesSize * 100).toFixed(2));
        },
        allImagesProcessed () {
            return this.images.length ? this.images.every(image => image.processedFile) : false;
        }
    }
})