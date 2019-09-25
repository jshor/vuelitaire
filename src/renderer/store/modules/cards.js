import Vue from 'vue'
// import uuid from 'uuid/v4'
import Space from '../models/Space'

const state = {}

const getters = {
  /**
   * Returns all tableau space cards.
   *
   * @param {Object} state
   * @returns {Space[]}
   */
  tableau (state) {
    return Object
      .values(state)
      .filter(({ type }) => type === 'TABLEAU')
  },

  /**
   * Returns all foundation space cards.
   *
   * @param {Object} state
   * @returns {Space[]}
   */
  foundations (state) {
    return Object
      .values(state)
      .filter(({ type }) => type === 'FOUNDATION')
  }
}

const actions = {
  revealCard ({ commit }, cardId) {
    commit('REVEAL_CARD', cardId)
    commit('CLEAR_HINTS')
  }
}

const mutations = {
  /**
   * Takes each card in the deck and stores it in the state.
   * Its `id` is the key and the card itself is the value.
   *
   * @param {Object} state
   * @param {Card[]} deck - deck of cards
   */
  REGISTER_CARDS (state, deck) {
    deck.forEach(card => {
      state[card.id] = card
    })
  },

  /**
   * Creates a new tableau (7 spaces, each having `index` descendant cards).
   *
   * @param {Object} state
   * @param {Card[]} deck - deck of cards to populate the tableau
   */
  INIT_TABLEAU (state, deck) {
    for (let i = 1; i <= 7; i++) {
      let parent = new Space('TABLEAU', 12)

      // assign the first card to the tableau row
      state[parent.id] = parent

      // move the last n cards from the deck to the tableau
      deck
        .splice(deck.length - i, i)
        .forEach(card => {
          // assign the next card to be the child of the previous card
          Vue.set(state[parent.id], 'child', card)
          Vue.set(state[card.id], 'isPlayed', true)
          parent = card
        })
    }
  },

  /**
   * Creates 4 new foundations.
   *
   * @param {Object} state
   */
  INIT_FOUNDATIONS (state) {
    for (let i = 0; i < 4; i++) {
      const space = new Space('FOUNDATION', 0)

      state[space.id] = space
    }
  },

  /**
   * Moves a card having `cardId` onto a card having `targetId`.
   *
   * @param {Object} state
   * @param {Object} payload
   * @param {Object} payload.cardId - id of the moving card
   * @param {Object} payload.targetId - id of the new parent
   */
  MOVE_CARD (state, { cardId, targetId }) {
    const card = state[cardId]
    const parent = Object
      .values(state)
      .find(({ child }) => child && child.id === card.id)

    if (parent) {
      Vue.set(state[parent.id], 'child', null)
    }
    Vue.set(state[cardId], 'isPlayed', true)
    Vue.set(state[targetId], 'child', card)
    // Vue.set(state, '_uuid', uuid()) // needed for reactivity
  },

  REVEAL_CARD (state, cardId) {
    Vue.set(state[cardId], 'revealed', true)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
