import Vue from 'vue'
import App from './App'
import store from './store'

new Vue({
  components: { App },
  store,
  template: '<App/>'
}).$mount('#app')
