import { GetterTree, ModuleTree, Module, MutationTree } from 'vuex'
import { remove, shuffle, values } from 'lodash'
import Vue from 'vue'
import { Suits } from '../../../constants'
import ICard from '../../../interfaces/ICard'
import Card from '../../../models/Card'
import LaneSpace from '../../../models/LaneSpace'
import Pair from '../../../models/Pair'
import cards from './cards'
import IDeckState from '../../../interfaces/IDeckState'
import IRootState from '../../../interfaces/IDeckState'

const state: IDeckState = {
  cards: {},
  move: null,
  stock: [], // cards in the stock pile
  waste: [], // the pile of cards dealt
  dealt: [], // the last `dealCount` (or fewer) cards dealt
  dealCount: 1 // number of cards to deal at a time
}

const namespaced: boolean = true

const getters: GetterTree<IDeckState, IRootState> = {
  /**
   * Returns whether or not cards can be dealt.
   *
   * @param {IDeckState} state
   */
  canDeal (state: IDeckState): boolean {
    return state.stock.length > 0
  }
}

const mutations: MutationTree<IDeckState> = {
  /**
   * Creates a new deck with 4 suits of 13 ranks each.
   *
   * @param {IDeckState} state
   */
  INIT_DECK (state: IDeckState): void {
    const createSuit = (suit): Card[] => Array(13) // TODO: enum suits
      .fill(null)
      .map((l, rank: number): Card => new Card(suit, rank)) // TODO: enum ranks

    const stock: Card[] = [
      ...createSuit(Suits.SPADES),
      ...createSuit(Suits.HEARTS),
      ...createSuit(Suits.DIAMONDS),
      ...createSuit(Suits.CLUBS)
    ]

    shuffle(stock).forEach((card: Card): void => {
      state.stock.push(card)
      state.cards[card.id] = card
    })
  },

  /**
   * Creates a new tableau (7 spaces, each having `index` descendant cards).
   *
   * @param {IDeckState} state
   */
  INIT_TABLEAU (state: IDeckState): void {
    let index = 0

    for (let i: number = 7; i > 0; i--) {
      let parent: ICard = new LaneSpace()

      // assign the first lane space card to the tableau row
      state.cards[parent.id] = parent

      // move the last n cards from the stock pile to the tableau
      state
        .stock
        .splice(state.stock.length - i, i)
        .forEach((card: ICard): void => {
          // assign the next card to be the child of the previous card
          Vue.set(state.cards[parent.id], 'child', card)
          Vue.set(state.cards[card.id], 'isPlayed', true)
          Vue.set(state.cards[card.id], 'animationIndex', ++index)

          parent = card
        })
    }
  },

  /**
   * Deals `dealCount` cards into the waste and dealt piles.
   *
   * @param {IDeckState} state
   */
  DEAL (state: IDeckState): void {
    Vue.set(state, 'dealt', [])

    if (state.stock.length === 0) {
      // reset the waste pile and stock
      Vue.set(state, 'stock', state.waste.reverse())
      Vue.set(state, 'waste', [])
    } else {
      for (let i: number = 0; i < state.dealCount; i++) {
        // deal as many cards as possible up to `dealCount`
        if (state.stock.length) {
          const card: ICard = state.stock.pop()

          state.waste.push(card)
          state.dealt.push(card)
        }
      }
    }
  },

  /**
   * Removes the card having the given id from the waste pile.
   *
   * @param {IDeckState} state
   * @param {String} cardId - id of card to remove
   */
  REMOVE_FROM_DECK (state: IDeckState, cardId: string): void {
    const predicate = ({ id }: Card): boolean => id === cardId

    remove(state.waste, predicate)
    remove(state.dealt, predicate)
  },

  /**
   * Sets information about a move from one card to allow animations during undo.
   * If there is no parent card present for a moving card, assume it came from the dealt pile.
   *
   * @param {IDeckState} state
   * @param {Pair} move
   */
  SET_MOVE (state: IDeckState, move: Pair = null): void {
    if (move) {
      const parent = values(state.cards)
        .filter((card: ICard) => card.child)
        .find((card: ICard) => card.child.id === move.cardId)

      move.parentId = parent ? parent.id : 'DEAL_CARD'
    }
    state.move = move
  }
}

const modules: ModuleTree<IDeckState> = { cards }

const deck: Module<IDeckState, IRootState> = {
  namespaced,
  state,
  getters,
  mutations,
  modules
}

export default deck
