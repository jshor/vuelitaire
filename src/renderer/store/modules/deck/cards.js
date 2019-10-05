import Vue from 'vue'
import FoundationSpace from '../../models/FoundationSpace'

const state = {}

const getters = {
  /**
   * Returns all tableau space cards.
   *
   * @param {Object} state
   * @returns {LaneSpace[]}
   */
  tableau (state) {
    return Object
      .values(state)
      .filter(card => card.constructor.name === 'LaneSpace')
  },

  /**
   * Returns all foundation space cards.
   *
   * @param {Object} state
   * @returns {FoundationSpace[]}
   */
  foundations (state) {
    return Object
      .values(state)
      .filter(card => card.constructor.name === 'FoundationSpace')
  }
}

const actions = {}

const mutations = {
  /**
   * Reveals all the cards in the stock and top cards in the tableau.
   *
   * @param {Object} state
   */
  REVEAL_CARDS (state) {
    Object
      .values(state)
      .filter(c => !c.child)
      .forEach(({ id }) => {
        Vue.set(state[id], 'revealed', true)
      })
  },

  /**
   * Creates 4 new foundations.
   *
   * @param {Object} state
   */
  INIT_FOUNDATIONS (state) {
    for (let i = 0; i < 4; i++) {
      const space = new FoundationSpace()

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
      Vue.set(state[parent.id], 'revealed', true)
    }

    Vue.set(state[cardId], 'promoted', state[targetId].promoted)
    Vue.set(state[cardId], 'isPlayed', true)
    Vue.set(state[targetId], 'child', card)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
