import Vue from 'vue'
import Vuex from 'vuex'
import root from './modules/root'
import cards from './modules/cards'
import deck from './modules/deck'
import hints from './modules/hints'

Vue.use(Vuex)

export default new Vuex.Store({
  ...root,
  modules: {
    cards,
    deck,
    hints
  },
  strict: process.env.NODE_ENV !== 'production'
})
