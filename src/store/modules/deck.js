
import { shuffle } from 'lodash'
import { Suits } from '@/constants'
import Card from '../models/Card'
import Vue from 'vue'

const state = {
  cards: [],
  waste: [],
  dealt: [],
  index: -1,
  dealCount: 3
}

const getters = {
  canDeal (state) {
    return state.cards.length
  }
}

const mutations = {
  INIT_DECK (state) {
    const createSuit = (suit) => Array(13)
      .fill(null)
      .map((l, rank) => new Card(suit, rank))

    const deck = [
      ...createSuit(Suits.SPADES),
      ...createSuit(Suits.HEARTS),
      ...createSuit(Suits.DIAMONDS),
      ...createSuit(Suits.CLUBS)
    ]

    shuffle(deck).forEach(card => state.cards.push(card))
  },

  DEAL (state) {
    Vue.set(state, 'dealt', [])

    if (state.cards.length === 0) {
      Vue.set(state, 'cards', state.waste.reverse())
      Vue.set(state, 'waste', [])
    } else {
      for (let i = 0; i < state.dealCount; i++) {
        if (state.cards.length) {
          const card = state.cards.pop()

          state.waste.push(card)
          state.dealt.push(card)
        }
      }
    }
  },

  REMOVE_FROM_DECK (state, cardId) {
    const index = state.waste.findIndex(({ id }) => id === cardId)

    if (~index) {
      state.waste.splice(index, 1)
    }
  }
}

export default {
  getters,
  state,
  mutations
}
