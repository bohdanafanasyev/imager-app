export default {
    vite: {
        optimizeDeps: {
            exclude: [
                "@jsquash/png",
                "@jsquash/avif",
                "@jsquash/webp",
                "@jsquash/jpeg"
            ]
        }
    },
} 