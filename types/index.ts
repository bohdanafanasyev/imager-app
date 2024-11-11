export type Image = {
    file: File
    newName: string
    encodedArrayBuffer: ArrayBuffer | null
    creationDate: Date | null
    format: {
        original: string
        converted: string
    }
    thumbnail: {
        url: string
        loadError: boolean
    }
}
