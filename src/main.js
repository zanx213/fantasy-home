import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { setupAntdIcon } from './assets/icon'
import '@/assets/style/index.scss'

import 'ant-design-vue/es/message/style/css'

const app = createApp(App)
setupAntdIcon(app) // 图标

app.use(router).use(createPinia()).mount('#app')
