import Vue from 'vue'
import { shuffle } from 'lodash'
import { Suits } from '../../../constants'
import Card from '../../models/Card'
import LaneSpace from '../../models/LaneSpace'
import cards from './cards'

const createState = () => ({
  move: null,
  stock: [], // cards in the stock pile
  waste: [], // the pile of cards dealt
  dealt: [], // the last `dealCount` (or fewer) cards dealt
  dealCount: 1 // number of cards to deal at a time
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

    const stock = [
      ...createSuit(Suits.SPADES),
      ...createSuit(Suits.HEARTS),
      ...createSuit(Suits.DIAMONDS),
      ...createSuit(Suits.CLUBS)
    ]

    shuffle(stock).forEach((card, index) => {
      card.animationIndex = index
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
    for (let i = 7; i > 0; i--) {
      let parent = new LaneSpace()

      // assign the first lane space card to the tableau row
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
    const wasteIndex = state.waste.findIndex(({ id }) => id === cardId)
    const dealtIndex = state.dealt.findIndex(({ id }) => id === cardId)

    if (~wasteIndex) {
      state.waste.splice(wasteIndex, 1)
    }

    if (~dealtIndex) {
      state.dealt.splice(dealtIndex, 1)
    }
  },

  /**
   * Sets information about a move from one card to allow animations during undo.
   * If there is no parent card present for a moving card, assume it came from the dealt pile.
   *
   * @param {Object} state
   * @param {Pair} move
   */
  SET_MOVE (state, move = null) {
    if (move) {
      const parent = Object
        .values(state.cards)
        .filter(card => card.child)
        .find(card => card.child.id === move.cardId)

      move.parentId = parent ? parent.id : 'DEAL_CARD'
    }
    state.move = move
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
