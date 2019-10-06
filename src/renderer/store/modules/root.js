import Vue from 'vue'
import uuid from 'uuid/v4'
import deck from './deck'
import animation from './animation'
import hints from './hints'
import Pair from '../models/Pair'
import { cloneDeep } from 'lodash'

const state = {
  gameId: uuid(),
  revertibleStates: [],
  selectedCard: null
}

const getters = {
  /**
   * Returns a list of card ids that should be highlighted.
   *
   * @param {Object} state
   * @returns {String[]}
   */
  highlightedCards (state) {
    if (state.selectedCard) {
      return [state.selectedCard.id]
    }
    return state.hints.entries[state.hints.index] || []
  },

  canUndo (state) {
    return state.revertibleStates.length > 0
  }
}

function wait (ms) {
  return new Promise((resolve, reject) => setTimeout(resolve, ms))
}

const actions = {
  async newGame ({ commit }) {
    commit('CLEAR_GAME')
    commit('animation/SET_IN_PROGRESS', true)
    commit('deck/INIT_DECK')
    commit('deck/INIT_TABLEAU')
    commit('deck/cards/INIT_FOUNDATIONS')

    // wait for the initial load animation to complete
    await wait(28 * 50) // 28 cards at 50 ms each

    commit('deck/cards/REVEAL_CARDS')
    commit('deck/cards/CLEAR_ANIMATION_INDICES')
    commit('animation/SET_IN_PROGRESS', false)
  },

  moveCard ({ commit }, pair) {
    commit('deck/SET_MOVE', pair)
    commit('RECORD_REVERTIBLE_STATE')
    commit('deck/cards/MOVE_CARD', pair)
    commit('deck/REMOVE_FROM_DECK', pair.cardId)
    commit('hints/CLEAR_HINTS')
  },

  deal ({ commit }) {
    commit('deck/SET_MOVE', null)
    commit('RECORD_REVERTIBLE_STATE')
    commit('deck/DEAL')
    commit('hints/CLEAR_HINTS')
  },

  async undo ({ commit, dispatch }) {
    const last = state.revertibleStates.slice(-1).pop()

    await dispatch('animation/reverse', last)
    commit('REVERT_TO_PREV_STATE')
    commit('hints/CLEAR_HINTS')
  },

  /**
   * Selects a card. If one is already selected, try to move the previously-selected one onto it.
   *
   * @param {Vuex} store
   * @param {Card} target
   * @returns {Promise}
   */
  async setSelection ({ commit, dispatch, state }, target) {
    if (state.selectedCard && target.canAcceptCard(state.selectedCard)) {
      const payload = new Pair(state.selectedCard.id, target.id)

      commit('SELECT_CARD', null)

      await dispatch('animation/move', payload)
      await dispatch('moveCard', payload)
    } else {
      commit('SELECT_CARD', target)
    }
  },

  clearSelection ({ commit }) {
    commit('SELECT_CARD', null)
  }
}

const mutations = {
  /**
   * Sets the actively-selected card.
   *
   * @param {Object} state
   * @param {String} cardId
   */
  SELECT_CARD (state, cardId) {
    state.selectedCard = cardId
  },

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
    animation,
    deck,
    hints
  }
}
