import Vue from 'vue'
import { cloneDeep } from 'lodash'
import uuid from 'uuid/v4'
import Foundation from '../models/Foundation'

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
    for (let i = 0; i < 7; i++) {
      let parent = new Foundation('TABLEAU')

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
      const space = new Foundation('FOUNDATION')

      state[space.id] = space
    }
  },

  MOVE_CARD (state, { cardId, targetId }) {
    const card = state[cardId]

    Object
      .values(state)
      .filter(({ child }) => child && child.id === card.id)
      .forEach(oldParent => {
        Vue.set(state[oldParent.id], 'child', null)
        Vue.set(state, oldParent.id, cloneDeep(oldParent)) // necessary for getter reactivity
      })

    Vue.set(state[targetId], 'child', card)
    Vue.set(state, '_uuid', uuid())
  }
}

export default {
  state,
  getters,
  mutations
}
