import { createApp } from 'vue'

import store from './store'
import router from './router'

import './assets/scss/index.scss'

import App from './App.vue'
import Btn from './components/global/Button.global.vue'
import SvgIcon from './components/global/SvgIcon.global.vue'

import 'virtual:svg-icons-register'

const app = createApp(App)
app.use(router)
app.use(store)
// Google tag manager configuration

// Registering global components
app.component('Btn', Btn)
app.component('SvgIcon', SvgIcon)

app.mount('#app')
