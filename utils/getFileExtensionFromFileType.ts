export function getFileExtensionFromFileType(fileType: string): string {
    return fileType.split('/').pop() || ''
}
