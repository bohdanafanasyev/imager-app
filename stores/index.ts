import { defineStore } from 'pinia'
import { renameFiles } from '~/util'

export const useMainStore = defineStore('main', {
    state: () => ({
        rename: true,
        startingDate: 1,
        optimiseSize: true,
        files: [],
    }),
    actions: {
        setFiles(value: any) {
            this.files = value

            this.renameFiles()
        },
        renameFiles() {
            renameFiles(this.files, Number(this.startingDate))
        },
    },
    getters: {
        totalFilesSize() {
            return this.files.reduce((acc, file) => acc + file.size, 0)
        },
        optimisedFilesSize() {
            return this.totalFilesSize * 0.7;
        },
        savedFilesSize() {
            return this.totalFilesSize - this.optimisedFilesSize;
        },
        savedFilesPercentage() {
            return Number((this.savedFilesSize / this.totalFilesSize * 100).toFixed(2));
        }
    }
})