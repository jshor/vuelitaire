import Vue from 'vue'
import uuid from 'uuid/v4'
import Space from '@/store/models/Space'
import isDescendant from '@/utils/isDescendant'

const state = {}

const getters = {
  tableau (state) {
    return Object
      .values(state)
      .filter(({ type }) => type === 'TABLEAU')
  },

  foundations (state) {
    return Object
      .values(state)
      .filter(({ type }) => type === 'FOUNDATION')
  }
}

const mutations = {
  REGISTER_CARDS (state, deck) {
    deck.forEach(card => {
      state[card.id] = card
    })
  },

  INIT_TABLEAU (state, deck) {
    for (let i = 1; i <= 7; i++) {
      let parent = new Space('TABLEAU')

      // assign the first card to the tableau row
      state[parent.id] = parent

      // move the last n cards from the deck to the tableau
      deck
        .splice(deck.length - i, i)
        .forEach(card => {
          // assign the next card to be the child of the previous card
          Vue.set(state[parent.id], 'child', card)
          parent = card
        })
    }
  },

  INIT_FOUNDATIONS (state) {
    for (let i = 0; i < 4; i++) {
      const space = new Space('FOUNDATION')

      state[space.id] = space
    }
  },

  MOVE_CARD (state, { cardId, targetId }) {
    const card = state[cardId]
    const parent = Object
      .values(state)
      .find(({ child }) => child && child.id === card.id)

    if (isDescendant(card, targetId) || (parent && parent.id === targetId)) {
      return
    }

    if (parent) {
      Vue.set(state[parent.id], 'child', null)
    }

    Vue.set(state[targetId], 'child', card)
    Vue.set(state, '_uuid', uuid())
  }
}

export default {
  state,
  getters,
  mutations
}
