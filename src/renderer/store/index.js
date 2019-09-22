import Vue from 'vue'
import Vuex from 'vuex'
import uuid from 'uuid/v4'
import cards from './modules/cards'
import deck from './modules/deck'

Vue.use(Vuex)

const state = {
  gameId: uuid()
}

const actions = {
  newGame ({ commit, state }) {
    commit('CLEAR_EXISTING_GAME')
    commit('INIT_DECK')
    commit('REGISTER_CARDS', state.deck.cards)
    commit('INIT_TABLEAU', state.deck.cards)
    commit('INIT_FOUNDATIONS')
    commit('REVEAL_CARDS')
  },

  moveCard ({ commit }, { cardId, targetId }) {
    commit('REMOVE_FROM_DECK', cardId)
    commit('MOVE_CARD', { cardId, targetId })
  }
}

const mutations = {
  CLEAR_EXISTING_GAME (state) {
    Vue.set(state, 'cards', {})
    Vue.set(state, 'deck', deck.createState())
    Vue.set(state, 'gameId', uuid())
  },

  REVEAL_CARDS (state) {
    Object
      .values(state.cards)
      .filter(c => !c.child)
      .forEach(({ id }) => {
        Vue.set(state.cards[id], 'revealed', true)
      })
  }
}

export default new Vuex.Store({
  state,
  actions,
  mutations,
  modules: {
    cards,
    deck
  },
  strict: process.env.NODE_ENV !== 'production'
})
