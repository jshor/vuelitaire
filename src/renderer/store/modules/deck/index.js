import Vue from 'vue'
// import uuid from 'uuid/v4'
import { shuffle } from 'lodash'
import { Suits } from '../../../constants'
import Card from '../../models/Card'
import LaneSpace from '../../models/LaneSpace'
import cards from './cards'

const createState = () => ({
  stock: [], // cards in the stock pile
  waste: [], // the pile of cards dealt
  dealt: [], // the last `dealCount` (or fewer) cards dealt
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
    return state.stock.length > 0
  }
}

const actions = {}

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

    shuffle(deck).forEach(card => {
      state.stock.push(card)
      state.cards[card.id] = card
    })
  },

  /**
   * Creates a new tableau (7 spaces, each having `index` descendant cards).
   *
   * @param {Object} state
   * @param {Card[]} deck - deck of cards to populate the tableau
   */
  INIT_TABLEAU (state) {
    for (let i = 1; i <= 7; i++) {
      let parent = new LaneSpace()

      // assign the first card to the tableau row
      state.cards[parent.id] = parent

      // move the last n cards from the stock pile to the tableau
      state
        .stock
        .splice(state.stock - i, i)
        .forEach(card => {
          // assign the next card to be the child of the previous card
          Vue.set(state.cards[parent.id], 'child', card)
          Vue.set(state.cards[card.id], 'isPlayed', true)
          parent = card
        })
    }
  },

  /**
   * Deals `dealCount` cards into the waste and dealt piles.
   *
   * @param {Object} state
   */
  DEAL (state) {
    Vue.set(state, 'dealt', [])

    if (state.stock.length === 0) {
      // reset the waste pile and stock
      Vue.set(state, 'stock', state.waste.reverse())
      Vue.set(state, 'waste', [])
    } else {
      for (let i = 0; i < state.dealCount; i++) {
        // deal as many cards as possible up to `dealCount`
        if (state.stock.length) {
          const card = state.stock.pop()

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
    const indexo = state.dealt.findIndex(({ id }) => id === cardId)

    if (~index) {
      state.waste.splice(index, 1)
    }

    if (~indexo) {
      state.dealt.splice(indexo, 1)
    }
  }
}

export default {
  namespaced: true,
  createState,
  state,
  getters,
  actions,
  mutations,
  modules: { cards }
}
