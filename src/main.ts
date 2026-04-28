import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

app.config.errorHandler = (err, vm, info) => {
  console.error('Error:', err)
  console.error('Component instance:', vm)
  console.error('Info:', info)
}
app.use(pinia)
app.mount('#app')
