import Vue from 'vue'
import Vuex from 'vuex'
import root from './modules/root'

Vue.use(Vuex)

export default new Vuex.Store({
  ...root,
  strict: process.env.NODE_ENV !== 'production'
})
