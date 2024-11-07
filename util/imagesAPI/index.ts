const processImagesViaAPI = async (): Promise<void> => {
    const files = mainStore.files;

    if (!files || files.length === 0) return;

    const formData = new FormData();

    for (const file of files) {
        formData.append(
            'files',
            file,
            mainStore.rename ? file.newName : file.name
        );
    }

    const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
            'Authorization': `${ userToken.value }`
        },
        body: formData
    });

    const result = await response.json();

    if (result.success) {
        availableForDownload.value = true;
    }
};

const downloadFile = async (): Promise<void> => {
    const response = await fetch('/api/download', {
        headers: {
            'Authorization': `${ userToken.value }`
        }
    });
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'download.zip';
    a.click();
    URL.revokeObjectURL(url);
};
