import { defineStore } from 'pinia'
import type { Image } from '~/types'

export const useMainStore = defineStore('main', {
    state: () => ({
        rename: true,
        startingDate: 1,
        optimiseSize: true,
        processing: false,
        images: [] as Image[]
    }),
    actions: {
        setImages(images: Image[]) {
            this.images = images

            this.assignNewNames()
        },
        assignNewNames() {
            assignNewNames(this.images, this.startingDate)
        }
    },
    getters: {
        totalFilesSize(): number {
            return this.images.reduce((accumulator: number, image: Image) => accumulator + image.file.size, 0)
        },
        optimisedFilesSize(): number {
            return this.images.reduce((accumulator: number, image: Image) => {
                if (image.processedFile) {
                    return accumulator + image.processedFile.byteLength
                }

                return accumulator
            }, 0)
        },
        savedFilesSize(): number {
            if (this.optimisedFilesSize) {
                return this.totalFilesSize - this.optimisedFilesSize
            }

            return 0
        },
        savedFilesPercentage(): number {
            return Number((this.savedFilesSize / this.totalFilesSize * 100).toFixed(2))
        },
        allImagesProcessed(): boolean {
            return this.images.length ? this.images.every((image: Image) => image.processedFile) : false
        }
    }
})
