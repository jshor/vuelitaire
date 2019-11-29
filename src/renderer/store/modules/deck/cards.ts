import Vue from 'vue'
import { GetterTree, Module, MutationTree } from 'vuex'
import ICard from '../../../interfaces/ICard'
import ICardsState from '../../../interfaces/ICardsState'
import IDeckState from '../../../interfaces/IDeckState'
import FoundationSpace from '../../../models/FoundationSpace'
import LaneSpace from '../../../models/LaneSpace'
import Pair from '../../../models/Pair'

const state: ICardsState = {}

const namespaced: boolean = true

const getters: GetterTree<ICardsState, IDeckState> = {
  /**
   * Returns all tableau space cards.
   *
   * @param {ICardsState} state
   * @returns {LaneSpace[]} - list of 7 lane spaces
   */
  tableau (state: ICardsState): LaneSpace[] {
    const tableau = Object.values(state) as LaneSpace[]

    return tableau.filter((card: ICard): boolean => {
      return card instanceof LaneSpace
    })
  },

  /**
   * Returns all foundation space cards.
   *
   * @param {ICardsState} state
   * @returns {LaneSpace[]} - list of 4 foundation spaces
   */
  foundations (state: ICardsState): FoundationSpace[] {
    const foundations = Object.values(state) as FoundationSpace[]

    return foundations.filter((card: ICard): boolean => {
      return card instanceof FoundationSpace
    })
  }
}

const mutations: MutationTree<ICardsState> = {
  /**
   * Reveals all the cards in the stock and top cards in the tableau.
   *
   * @param {ICardsState} state
   */
  REVEAL_CARDS (state: ICardsState): void {
    Object.values(state)
      .filter(({ child }: ICard): boolean => !child)
      .forEach(({ id }: ICard): void => {
        Vue.set(state[id], 'revealed', true)
      })
  },

  /**
   * Marks a card to not be revealed (i.e., 'turned over').
   *
   * @param {ICardsState} state
   * @param cardId - id of the card to unreveal
   */
  UNREVEAL_CARD (state: ICardsState, cardId: string): void {
    if (state[cardId]) {
      state[cardId].revealed = false
    }
  },

  /**
   * Toggles the card `hasError` flag. When true, it causes the card to shake.
   *
   * @param {ICardsState} state
   * @param cardId - id of the card to unreveal
   */
  SET_CARD_ERROR (state: ICardsState, { cardId, hasError }: { cardId: string, hasError: boolean }): void {
    if (state[cardId]) {
      state[cardId].hasError = hasError
    }
  },

  /**
   * Resets all animation indices of all cards to 0.
   *
   * @param {ICardsState} state
   */
  CLEAR_ANIMATION_INDICES (state: ICardsState): void {
    Object.values(state)
      .forEach(({ id }: ICard): void => {
        state[id].animationIndex = 0
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

      state[space.id] = space
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
    const card: ICard = state[cardId]
    const parent: ICard = Object.values(state)
      .find(({ child }: ICard): boolean => {
        return child && child.id === card.id
      })

    if (parent) {
      Vue.set(state[parent.id], 'child', null)
      Vue.set(state[parent.id], 'revealed', true)
    }

    Vue.set(state[cardId], 'promoted', state[targetId].promoted)
    Vue.set(state[cardId], 'isPlayed', true)
    Vue.set(state[targetId], 'child', card)
  }
}

const cards: Module<ICardsState, IDeckState> = {
  namespaced,
  state,
  getters,
  mutations
}

export default cards
