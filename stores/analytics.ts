import { defineStore } from 'pinia'

export const useAnalyticsStore = defineStore('analytics', {
    state: () => ({
        allowed: true,
        abortEvent: {
            url: '',
            options: {}
        }
    })
})
