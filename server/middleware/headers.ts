import { extname } from 'path'

export default defineNuxtRouteMiddleware((to, from) => {
    const header = useResponseHeader('X-My-Always-Header')
    header.value = `I'm Always here!`
})
