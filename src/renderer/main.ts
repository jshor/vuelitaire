import Vue from 'vue'
import App from './App.vue'
import store from './store'

if (!process.env.IS_WEB) { Vue.use(require('vue-electron')) }
Vue.config.productionTip = false
Vue.config.devtools = true

new Vue({
  components: { App },
  store,
  template: '<App/>'
}).$mount('#app')
