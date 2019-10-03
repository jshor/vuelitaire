import Vue from 'vue'
import uuid from 'uuid/v4'
import deck from './deck'

const state = {
  gameId: uuid()
}

const getters = {
  hint (state) {
    return state.hints.entries[state.hints.index] || []
  }
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
    commit('CLEAR_HINTS')
    commit('SELECT_CARD', null)
  }
}

const mutations = {
  CLEAR_HINTS (state) {
    state.hints.entries = []
    state.hints.index = -1
  },

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

export default {
  state,
  getters,
  actions,
  mutations
}
