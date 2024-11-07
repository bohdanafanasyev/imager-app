import { extname } from 'path';

export default defineEventHandler((event) => {
    const url = event.req.url;

    console.log(url)

    if (extname(url) === '.wasm') {
        setResponseHeader(event, 'content-type', 'application/wasm');
    } else if (extname(url) === '.js') {
        setResponseHeader(event, 'content-type', 'application/javascript');
    }

    setResponseHeaders(event, {
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp'
    });

    // console.log(event.req.url)
})