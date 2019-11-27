import { ActionTree, MutationTree, ActionContext } from 'vuex'
import { values } from 'lodash'
import getDeckHints from '../../gameplay/hints/getDeckHints'
import getDestructuringLaneHints from '../../gameplay/hints/getDestructuringLaneHints'
import getLaneCreationHints from '../../gameplay/hints/getLaneCreationHints'
import getMoveableCardHints from '../../gameplay/hints/getMoveableCardHints'
import getWorryBackHints from '../../gameplay/hints/getWorryBackHints'
import ICard from '../../interfaces/ICard'
import ICardsState from '../../interfaces/ICardsState'
import IHintsState from '../../interfaces/IHintsState'
import IRootState from '../../interfaces/IRootState'

const state: IHintsState = {
  entries: [],
  index: -1
}

const actions: ActionTree<IHintsState, IRootState> = {
  /**
   * Shows a hint to the user. If no hints are generated, generate them.
   * If generated hints yields no results, a dialog will be presented to the user.
   *
   * @param {ActionContext<IHintsState, IRootState>} context
   */
  showHint ({ commit, dispatch, state }: ActionContext<IHintsState, IRootState>): void {
    if (state.entries.length === 0) {
      // if we have no hints for this state yet, generate them
      dispatch('generateHints')
    }

    // TODO: show electron dialog if there are still no hints

    commit('SHOW_NEXT_HINT')
  },

  /**
   * Commits generated game hints to the store.
   *
   * @param {ActionContext<IHintsState, IRootState>} context
   */
  generateHints ({ rootState, commit }: ActionContext<IHintsState, IRootState>): void {
    const { cards, waste }: {
      cards: ICardsState,
      waste: ICard[]
    } = rootState.deck
    const allCards: ICard[] = values(cards)
    const playableCards: ICard[] = allCards
      .filter((card) => card.isPlayable() && !card.promoted)
      .concat(waste.slice(-1))

    // generate basic hints
    let hints: string[][] = [
      ...getMoveableCardHints(allCards, playableCards, rootState.deck),
      ...getLaneCreationHints(allCards, playableCards, rootState.deck),
      ...getDeckHints(allCards, playableCards, rootState.deck)
    ]

    // if there were no hints available, try the "desperate" hints
    if (hints.length === 0) {
      hints = hints.concat(getDestructuringLaneHints(allCards, playableCards, rootState.deck))
      hints = hints.concat(getWorryBackHints(allCards, playableCards, rootState.deck))
    }

    commit('SET_HINTS', hints)
  }
}

const mutations: MutationTree<IHintsState> = {
  /**
   * Clears existing hints from the state. Resets the hint index.
   *
   * @param {IHintsState} state
   */
  CLEAR_HINTS (state: IHintsState): void {
    state.entries = []
    state.index = -1
  },

  /**
   * Stores the list of given hints.
   *
   * @param {IHintsState} state
   * @param hints - list of hints to store
   */
  SET_HINTS (state: IHintsState, hints: string[][]): void {
    hints.forEach((hint: string[]) => state.entries.push(hint))
  },

  /**
   * Shows the next generated hint in line. Cycles back if end of the list is reached.
   *
   * @param {IHintsState} state
   */
  SHOW_NEXT_HINT (state: IHintsState) {
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
