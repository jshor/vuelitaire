import { shuffle, values } from 'lodash'
import Vue from 'vue'
import { Suits } from '../../../constants'
import ICard from '../../../types/interfaces/ICard'
import Card from '../../../models/Card'
import LaneSpace from '../../../models/LaneSpace'
import Pair from '../../../models/Pair'
import cards, { CardsState } from './cards'

export class DeckState {
  public cards: CardsState = {}
  public move: Pair = null
  public stock: ICard[] = [] // cards in the stock pile
  public waste: ICard[] = [] // the pile of cards dealt
  public dealt: ICard[] = [] // the last `dealCount` (or fewer) cards dealt
  public dealCount: number = 1 // number of cards to deal at a time
}

const createState = () => new DeckState()

const state: DeckState = new DeckState()

const getters = {
  /**
   * Returns whether or not cards can be dealt.
   *
   * @param {DeckState} state
   */
  canDeal (state: DeckState): boolean {
    return state.stock.length > 0
  }
}

const actions = {}

const mutations = {
  /**
   * Creates a new deck with 4 suits of 13 ranks each.
   *
   * @param {DeckState} state
   */
  INIT_DECK (state: DeckState): void {
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
   * @param {DeckState} state
   */
  INIT_TABLEAU (state: DeckState): void {
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
   * @param {Object} state
   */
  DEAL (state: DeckState): void {
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
   * @param {DeckState} state
   * @param {String} cardId - id of card to remove
   */
  REMOVE_FROM_DECK (state: DeckState, cardId: string): void {
    const wasteIndex: number = state
      .waste
      .findIndex(({ id }: Card): boolean => id === cardId)
    const dealtIndex: number = state
      .dealt
      .findIndex(({ id }: Card): boolean => id === cardId)

    if (wasteIndex > 0) {
      state.waste.splice(wasteIndex, 1)
    }

    if (dealtIndex > 0) {
      state.dealt.splice(dealtIndex, 1)
    }
  },

  /**
   * Sets information about a move from one card to allow animations during undo.
   * If there is no parent card present for a moving card, assume it came from the dealt pile.
   *
   * @param {DeckState} state
   * @param {Pair} move
   */
  SET_MOVE (state: DeckState, move: Pair = null): void {
    if (move) {
      const parent = values(state.cards)
        .filter((card: ICard) => card.child)
        .find((card: ICard) => card.child.id === move.cardId)

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
