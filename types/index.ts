export type Image = {
    file: File
    newName: string
    encodedArrayBuffer: ArrayBuffer | null
    creationDate: Date | null
    thumbnail: {
        url: string
        loadError: boolean
    }
}
