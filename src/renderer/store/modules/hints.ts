import { values } from 'lodash'
import {
  getDeckHints,
  getDestructuringLaneHints,
  getLaneCreationHints,
  getMoveableCardHints,
  getWorryBackHints
} from '../../gameplay'
import BaseModel from '../models/BaseModel'
import { CardsState } from './deck/cards'

export class HintsState {
  public entries: string[][] = []
  public index: number = -1
}

const state: HintsState = new HintsState()

const actions = {
  showHint ({ commit, dispatch, state }): void {
    if (state.entries.length === 0) {
      // if we have no hints for this state yet, generate them
      dispatch('generateHints')
    }

    // TODO: show electron dialog if there are still no hints

    commit('SHOW_NEXT_HINT')
  },

  generateHints ({ rootState, commit }): void {
    const { cards, waste }: {
      cards: CardsState,
      waste: BaseModel[]
    } = rootState.deck
    const allCards: BaseModel[] = values(cards)
    const playableCards: BaseModel[] = allCards
      .filter((card) => card.isPlayable() && !card.promoted)
      .concat(waste.slice(-1))

    // generate basic hints
    let hints: string[][] = [
      ...getMoveableCardHints(allCards, playableCards),
      ...getLaneCreationHints(allCards, playableCards),
      ...getDeckHints(allCards, rootState.deck)
    ]

    // if there were no hints available, try the "desperate" hints
    if (hints.length === 0) {
      hints = hints.concat(getDestructuringLaneHints(allCards))
      hints = hints.concat(getWorryBackHints(allCards, rootState.deck))
    }

    commit('SET_HINTS', hints)
  }
}

const mutations = {
  CLEAR_HINTS (state): void {
    state.entries = []
    state.index = -1
  },

  SET_HINTS (state: HintsState, hints: string[][]): void {
    hints.forEach((hint: string[]) => state.entries.push(hint))
  },

  SHOW_NEXT_HINT (state: HintsState) {
    state.index++

    if (state.index >= state.entries.length) {
      // if we're all out of hints, show the first hint again
      state.index = 0
    }
  }
}

export default {
  namespaced: true,
  actions,
  state,
  mutations
}
