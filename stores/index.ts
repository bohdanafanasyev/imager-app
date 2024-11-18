import { defineStore } from 'pinia'
import type { Image, PerformanceStats } from '~/types'
import { QUALITY, SUPPORTED_ENCODER_IMAGE_FORMATS } from '~/values'

export const useMainStore = defineStore('main', {
    state: () => ({
        rename: true,
        startingDay: '1',
        optimise: true,
        quality: QUALITY.seventy,
        outputFormat: SUPPORTED_ENCODER_IMAGE_FORMATS.webp,
        lastOptimisationSettings: {
            quality: QUALITY.seventy,
            outputFormat: SUPPORTED_ENCODER_IMAGE_FORMATS.webp
        },
        isOptimising: false,
        isDebugMode: false,
        images: new Map<string, Image>()
    }),
    actions: {
        addImages(images: Image[]) {
            const processBatch = (startIndex: number) => {
                const maxBatchSize = Math.floor(Math.random() * 11) + 20 // Random batch size between 20 and 30
                const imagesToAdd = images.slice(startIndex, startIndex + maxBatchSize)
                imagesToAdd.forEach((image) => {
                    if (!this.images.has(image.file.name)) {
                        this.images.set(image.file.name, image)
                    }
                })

                // In the beginning assign new names only to the first batch
                if (startIndex === 0) {
                    this.assignNewNames()
                }

                if (startIndex + maxBatchSize < images.length) {
                    setTimeout(() => processBatch(startIndex + maxBatchSize), 0)
                }
                else {
                    // Assign new names to all images after the all images have been added
                    this.assignNewNames()
                }
            }

            processBatch(0)
        },
        assignNewNames() {
            assignNewNames(this.imagesArray, Number(this.startingDay))
        },
        removeImage(imageId: string) {
            this.images.delete(imageId)
        },
        onReOptimise() {
            this.lastOptimisationSettings = {
                quality: this.quality,
                outputFormat: this.outputFormat
            }
            this.images.forEach((image) => image.optimisationResult = null)
        }
    },
    getters: {
        imagesArray(): Image[] {
            return Array.from(this.images.values())
        },
        totalFilesSize(): number {
            return this.imagesArray.reduce((accumulator: number, image: Image) => accumulator + image.file.size, 0)
        },
        totalOptimisedFiles(): number {
            return this.imagesArray.filter((image: Image) => image.optimisationResult).length
        },
        allImagesOptimised(): boolean {
            return this.images.size ? this.imagesArray.every((image: Image) => image.optimisationResult) : false
        },
        optimisedFilesSize(): number {
            return this.imagesArray.reduce((accumulator: number, image: Image) => {
                if (image.optimisationResult?.arrayBuffer) {
                    return accumulator + image.optimisationResult.arrayBuffer.byteLength
                }

                // If the image has not been optimised, return the original size
                return accumulator + image.file.size
            }, 0)
        },
        shouldGetOptimisedResult(): boolean {
            return this.optimise && this.images.size > 0 && this.allImagesOptimised
        },
        savedFilesSize(): number {
            if (this.shouldGetOptimisedResult) {
                return this.totalFilesSize - this.optimisedFilesSize
            }

            return 0
        },
        savedFilesPercentage(): number {
            if (this.shouldGetOptimisedResult) {
                return Number((this.savedFilesSize / this.totalFilesSize * 100).toFixed(2))
            }

            return 0
        },
        co2Saved(): number {
            if (this.shouldGetOptimisedResult) {
                return calculateCO2Emissions(this.totalFilesSize, this.optimisedFilesSize).reduction
            }

            return 0
        },
        performanceStats(): PerformanceStats | null {
            if (this.shouldGetOptimisedResult && this.isDebugMode) {
                const stats = this.imagesArray.reduce((accumulator: PerformanceStats, image: Image) => {
                    const { decoding, encoding, total } = image.optimisationResult!.performance

                    accumulator.decoding += decoding
                    accumulator.encoding += encoding
                    accumulator.total += total

                    return accumulator
                }, { decoding: 0, encoding: 0, total: 0 })

                return {
                    decoding: Number(stats.decoding.toFixed(2)),
                    encoding: Number(stats.encoding.toFixed(2)),
                    total: Number(stats.total.toFixed(2))
                }
            }

            return null
        },
        optimisationSettingsChanged(): boolean {
            return this.quality !== this.lastOptimisationSettings.quality || this.outputFormat !== this.lastOptimisationSettings.outputFormat
        }
    }
})
