import { defineStore } from 'pinia'
import type {
    Image,
    PerformanceStats,
    RenameOptions,
    OptimiseOptions
} from '~/types'
import { useAppStore } from '~/stores/app'
import {
    QUALITY,
    SUPPORTED_ENCODER_IMAGE_FORMATS,
    RENAME_OPTIONS
} from '~/values'
import { assignNewNames } from '~/utils/assignNewNames'

export const useImagesStore = defineStore('images', {
    state: () => ({
        images: new Map<string, Image>(),
        optimiseOptions: {
            enabled: true,
            format: SUPPORTED_ENCODER_IMAGE_FORMATS.webp,
            isOptimising: false,
            lastSettings: {
                quality: QUALITY.seventy,
                format: SUPPORTED_ENCODER_IMAGE_FORMATS.webp
            },
            quality: QUALITY.seventy
        } as OptimiseOptions,
        renameOptions: {
            enabled: true,
            preset: RENAME_OPTIONS.numericOrder,
            startingDay: '1',
            startingIndex: 1,
            use12hFormat: false
        } as RenameOptions
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
            assignNewNames(this.imagesArray, this.renameOptions)
        },
        removeImage(imageId: string) {
            this.images.delete(imageId)
        },
        onReOptimise() {
            this.optimiseOptions.lastSettings = {
                quality: this.optimiseOptions.quality,
                format: this.optimiseOptions.format
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
        shouldGetOptimisedResult(): boolean {
            return this.optimiseOptions.enabled && this.images.size > 0 && this.allImagesOptimised
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
        optimisationSettingsChanged(): boolean {
            return this.optimiseOptions.quality !== this.optimiseOptions.lastSettings.quality || this.optimiseOptions.format !== this.optimiseOptions.lastSettings.format
        }
    }
})
