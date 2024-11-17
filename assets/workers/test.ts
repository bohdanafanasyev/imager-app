// assets/workers/worker.ts
self.onmessage = function (e) {
    const { data, command } = e.data

    if (command === 'start') {
        // Perform some work
        const result = `Processed: ${data}`
        self.postMessage({ result })
    }
    else if (command === 'abort') {
        self.postMessage({ error: 'Aborted' })
        self.close()
    }
}
