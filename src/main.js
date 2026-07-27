// import './assets/main.css'
// import '@/assets/style.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

// Firebase
import { initializeApp } from 'firebase/app'

const app = createApp(App)
app.use(PrimeVue, { theme: { preset: Aura } })
app.use(router)

app.mount('#app')

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5SObt6nA64x2gm96PQHvkC-3uTmSe_Qg",
  authDomain: "project-yuhanpei.firebaseapp.com",
  projectId: "project-yuhanpei",
  storageBucket: "project-yuhanpei.firebasestorage.app",
  messagingSenderId: "979669416366",
  appId: "1:979669416366:web:bc03ed281bd5987f6e303f"
}

// Initialize Firebase
initializeApp(firebaseConfig)
