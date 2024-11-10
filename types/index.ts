export type Image = {
    file: File
    newName: string
    processedFile: ArrayBuffer | null
    creationDate: Date | null
    thumbnail: {
        url: string
        loadError: boolean
    }
}
