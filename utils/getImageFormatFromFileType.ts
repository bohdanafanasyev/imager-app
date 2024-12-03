export function getImageFormatFromFileType(fileType: string): string {
    return fileType.split('/').pop() || ''
}
