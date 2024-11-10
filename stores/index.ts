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
        addImages(images: Image[]) {
            const existingImageNames = new Set(this.images.map((image) => image.file.name))
            const newImages = images.filter((image) => !existingImageNames.has(image.file.name))

            this.images.push(...newImages)
            this.assignNewNames()
        },
        assignNewNames() {
            assignNewNames(this.images, this.startingDate)
        },
        removeImage(index: number) {
            this.images.splice(index, 1)
        }
    },
    getters: {
        totalFilesSize(): number {
            return this.images.reduce((accumulator: number, image: Image) => accumulator + image.file.size, 0)
        },
        totalProcessedFiles(): number {
            return this.images.filter((image: Image) => image.encodedArrayBuffer).length
        },
        optimisedFilesSize(): number {
            return this.images.reduce((accumulator: number, image: Image) => {
                if (image.encodedArrayBuffer) {
                    return accumulator + image.encodedArrayBuffer.byteLength
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
            return this.images.length ? this.images.every((image: Image) => image.encodedArrayBuffer) : false
        }
    }
})
