import { values } from 'lodash'
import Vue from 'vue'
import ICard from '../../../types/interfaces/ICard'
import FoundationSpace from '../../../models/FoundationSpace'
import LaneSpace from '../../../models/LaneSpace'
import Pair from '../../../models/Pair'

interface ICardsMap {
  [id: string]: ICard
}

export class CardsState implements ICardsMap {
  [id: string]: ICard
}

const state: CardsState = {}

const getters = {
  /**
   * Returns all tableau space cards.
   */
  tableau (state: CardsState): LaneSpace[] {
    return values(state).filter((card: ICard): boolean => {
      return card instanceof LaneSpace
    })
  },

  /**
   * Returns all foundation space cards.
   */
  foundations (state: CardsState): FoundationSpace[] {
    return values(state).filter((card: ICard): boolean => {
      return card instanceof FoundationSpace
    })
  }
}

const actions = {}

const mutations = {
  /**
   * Reveals all the cards in the stock and top cards in the tableau.
   */
  REVEAL_CARDS (state: CardsState): void {
    values(state)
      .filter(({ child }: ICard): boolean => !child)
      .forEach(({ id }: ICard): void => {
        Vue.set(state[id], 'revealed', true)
      })
  },

  UNREVEAL_CARD (state: CardsState, cardId: string): void {
    if (state[cardId]) {
      state[cardId].revealed = false
    }
  },

  /**
   * Resets all animation indices of all cards to 0.
   */
  CLEAR_ANIMATION_INDICES (state: CardsState): void {
    values(state)
      .forEach(({ id }: ICard): void => {
        state[id].animationIndex = 0
      })
  },

  /**
   * Creates 4 new foundations.
   */
  INIT_FOUNDATIONS (state: CardsState): void {
    for (let i: number = 0; i < 4; i++) {
      const space: FoundationSpace = new FoundationSpace()

      state[space.id] = space
    }
  },

  /**
   * From the given pair, moves a card having `cardId` onto a card having `targetId`.
   */
  MOVE_CARD (state: CardsState, { cardId, targetId }: Pair): void {
    const card: ICard = state[cardId]
    const parent: ICard = values(state)
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

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
