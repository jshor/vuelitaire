import Vue from 'vue'
import uuid from 'uuid/v4'
import deck from './deck'
import hints from './deck/hints'
import { cloneDeep } from 'lodash'

const state = {
  gameId: uuid(),
  revertibleStates: []
}

const getters = {
  hint (state) {
    return state.hints.entries[state.hints.index] || []
  },

  canUndo (state) {
    return state.revertibleStates.length > 0
  }
}

const actions = {
  newGame ({ commit }) {
    commit('CLEAR_GAME')
    commit('deck/INIT_DECK')
    commit('deck/INIT_TABLEAU')
    commit('deck/cards/INIT_FOUNDATIONS')
    commit('deck/cards/REVEAL_CARDS')
  },

  moveCard ({ commit }, { cardId, targetId }) {
    commit('RECORD_REVERTIBLE_STATE')
    commit('deck/cards/MOVE_CARD', { cardId, targetId })
    commit('deck/REMOVE_FROM_DECK', cardId)
    commit('hints/CLEAR_HINTS')
  },

  deal ({ commit }) {
    commit('RECORD_REVERTIBLE_STATE')
    commit('deck/DEAL')
    commit('hints/CLEAR_HINTS')
  },

  undo ({ commit }) {
    commit('REVERT_TO_PREV_STATE')
    commit('hints/CLEAR_HINTS')
  }
}

const mutations = {
  CLEAR_GAME (state) {
    Vue.set(state, 'deck', deck.createState())
    Vue.set(state.deck, 'cards', {})
    Vue.set(state, 'gameId', uuid())
  },

  RECORD_REVERTIBLE_STATE (state) {
    state.revertibleStates.push(cloneDeep(state.deck))
  },

  REVERT_TO_PREV_STATE (state) {
    Vue.set(state, 'deck', state.revertibleStates.pop())
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
  modules: {
    deck,
    hints
  }
}
