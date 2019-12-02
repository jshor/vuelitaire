import Vue from 'vue'
import { Module, MutationTree } from 'vuex'
import ICard from '@/interfaces/ICard'
// import ICardsMap from '@/interfaces/ICardsMap'
import ICardsState from '@/interfaces/ICardsState'
import IDeckState from '@/interfaces/IDeckState'
import FoundationSpace from '@/models/FoundationSpace'
// import LaneSpace from '@/models/LaneSpace'
import Pair from '@/models/Pair'

const state: ICardsState = {
  foundations: {},
  tableau: {},
  regular: {}
}

const namespaced: boolean = true

const mutations: MutationTree<ICardsState> = {
  /**
   * Reveals all the cards in the stock and top cards in the tableau.
   *
   * @param {ICardsState} state
   */
  REVEAL_CARDS (state: ICardsState): void {
    Object.values(state.regular)
      .filter(({ child }: ICard): boolean => !child)
      .forEach(({ id }: ICard): void => {
        Vue.set(state.regular[id], 'revealed', true)
      })
  },

  /**
   * Marks a card to not be revealed (i.e., 'turned over').
   *
   * @param {ICardsState} state
   * @param cardId - id of the card to unreveal
   */
  UNREVEAL_CARD (state: ICardsState, cardId: string): void {
    if (state.regular[cardId]) {
      state.regular[cardId].revealed = false
    }
  },

  /**
   * Toggles the card `hasError` flag. When true, it causes the card to shake.
   *
   * @param {ICardsState} state
   * @param cardId - id of the card to unreveal
   */
  SET_CARD_ERROR (state: ICardsState, { cardId, hasError }: { cardId: string, hasError: boolean }): void {
    if (state.regular[cardId]) {
      state.regular[cardId].hasError = hasError
    }
  },

  /**
   * Resets all animation indices of all cards to 0.
   *
   * @param {ICardsState} state
   */
  CLEAR_ANIMATION_INDICES (state: ICardsState): void {
    Object.values(state.regular)
      .forEach(({ id }: ICard): void => {
        state.regular[id].animationIndex = 0
      })
  },

  /**
   * Creates 4 new foundations.
   *
   * @param {ICardsState} state
   */
  INIT_FOUNDATIONS (state: ICardsState): void {
    for (let i: number = 0; i < 4; i++) {
      const space: FoundationSpace = new FoundationSpace()

      state.foundations[space.id] = space
    }
  },

  /**
   * From the given pair, moves a card having `cardId` onto a card having `targetId`.
   * By default, this will reveal the moved card's parent (if any) and mark it as played.
   *
   * @param {ICardsState} state
   * @param {Pair} pair - card pairing to assign marriage to
   */
  MOVE_CARD (state: ICardsState, { cardId, targetId }: Pair): void {
    const card: ICard = state.regular[cardId]
    const target: ICard = state.regular[targetId]
      || state.foundations[targetId]
      || state.tableau[targetId]

    if (card.parent) {
      Vue.set(card.parent, 'child', null)
      Vue.set(card.parent, 'revealed', true)
      Vue.set(card, 'parent', null)
    }

    Vue.set(card, 'parent', target)
    Vue.set(card, 'promoted', target.promoted)
    Vue.set(target, 'child', card)
  }
}

const cards: Module<ICardsState, IDeckState> = {
  namespaced,
  state,
  mutations
}

export default cards
