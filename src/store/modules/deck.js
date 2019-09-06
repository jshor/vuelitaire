
import { shuffle } from 'lodash'
import { Suits } from '@/constants'
import Card from '../models/Card'

const state = []

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

    shuffle(deck).forEach(card => state.push(card))
  },

  REMOVE_FROM_DECK (state, cardId) {
    const index = state.deck.find(({ id }) => id === cardId)

    if (~index) {
      state.deck.splice(index, 1)
    }
  }
}

export default {
  state,
  mutations
}
