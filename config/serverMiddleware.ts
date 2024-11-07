export default {
    serverMiddleware: [
        '~/server/middleware/headers.ts',
        // Not currently needed
        // Would only be required to enable server side rendering of the images
        // {
        //     path: '/api/upload',
        //     handler: '~/server/api/upload.ts'
        // },
        // {
        //     path: '/api/download',
        //     handler: '~/server/api/download.ts'
        // }
    ],
}