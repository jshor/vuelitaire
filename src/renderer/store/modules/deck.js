import Vue from 'vue'
// import { shuffle } from 'lodash'
import { Suits } from '../../constants'
import Card from '../models/Card'

const createState = () => ({
  cards: [], // cards in the stock pile
  waste: [], // the pile of cards dealt
  dealt: [], // the last `dealCount` (or fewer) cards dealt
  index: -1, // index of last card dealt
  dealCount: 3 // number of cards to deal at a time
})

const state = createState()

const getters = {
  /**
   * Returns whether or not cards can be dealt.
   *
   * @param {Object} state
   */
  canDeal (state) {
    return state.cards.length > 0
  }
}

const actions = {
  deal ({ commit }) {
    commit('DEAL')
  }
}

const mutations = {
  /**
   * Creates a new deck with 4 suits of 13 ranks each.
   *
   * @param {Object} state
   */
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

    deck.forEach(card => state.cards.push(card))
  },

  /**
   * Deals `dealCount` cards into the waste and dealt piles.
   *
   * @param {Object} state
   */
  DEAL (state) {
    Vue.set(state, 'dealt', [])

    if (state.cards.length === 0) {
      // reset the waste pile and stock
      Vue.set(state, 'cards', state.waste.reverse())
      Vue.set(state, 'waste', [])
    } else {
      for (let i = 0; i < state.dealCount; i++) {
        // deal as many cards as possible up to `dealCount`
        if (state.cards.length) {
          const card = state.cards.pop()

          state.waste.push(card)
          state.dealt.push(card)
        }
      }
    }
  },

  /**
   * Removes the card having the given id from the waste pile.
   *
   * @param {Object} state
   * @param {String} cardId - id of card to remove
   */
  REMOVE_FROM_DECK (state, cardId) {
    const index = state.waste.findIndex(({ id }) => id === cardId)

    if (~index) {
      state.waste.splice(index, 1)
    }
  }
}

export default {
  createState,
  getters,
  actions,
  state,
  mutations
}
