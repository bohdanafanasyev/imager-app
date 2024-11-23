import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
    state: () => ({
        isDebugMode: false,
        isDesktopUI: true,
        showMobileSlideOver: false
    })
})
