import { initializeApp } from 'firebase/app'
// import { getAuth } from 'firebase/auth'
import { getAnalytics, logEvent } from 'firebase/analytics'

export default defineNuxtPlugin((nuxtApp) => {
    const firebaseConfig = {
        apiKey: 'AIzaSyA0Z9-u05jJS1Pv6nQOBarGQfxlIYlRsWI',
        authDomain: 'imager-ae464.firebaseapp.com',
        projectId: 'imager-ae464',
        storageBucket: 'imager-ae464.firebasestorage.app',
        messagingSenderId: '919198636229',
        appId: '1:919198636229:web:2fe7064ab2367b8ed078ac',
        measurementId: 'G-LP6TYN63QP'
    }

    const app = initializeApp(firebaseConfig)

    const analytics = getAnalytics(app)
    // const auth = getAuth(app)
    // const firestore = getFirestore(app)

    nuxtApp.vueApp.provide('analytics', analytics)
})
