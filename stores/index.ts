import { defineStore } from 'pinia'
import type { Image } from '~/types'

export const useMainStore = defineStore('main', {
    state: () => ({
        rename: true,
        startingDate: 1,
        optimise: true,
        isOptimising: false,
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
        totalOptimisedFiles(): number {
            return this.images.filter((image: Image) => image.encodedArrayBuffer).length
        },
        allImagesOptimised(): boolean {
            return this.images.length ? this.images.every((image: Image) => image.encodedArrayBuffer) : false
        },
        optimisedFilesSize(): number {
            return this.images.reduce((accumulator: number, image: Image) => {
                if (image.encodedArrayBuffer) {
                    return accumulator + image.encodedArrayBuffer.byteLength
                }

                return accumulator
            }, 0)
        },
        shouldGetOptimisedResult(): boolean {
            return this.optimise && this.images.length > 0 && this.allImagesOptimised
        },
        savedFilesSize(): number {
            if (this.shouldGetOptimisedResult) {
                return this.totalFilesSize - this.optimisedFilesSize
            }

            return 0
        },
        savedFilesPercentage(): number {
            return Number((this.savedFilesSize / this.totalFilesSize * 100).toFixed(2))
        },
        co2Saved(): number {
            if (this.shouldGetOptimisedResult) {
                return calculateCO2Emissions(this.totalFilesSize, this.optimisedFilesSize).reduction
            }

            return 0
        }
    }
})
