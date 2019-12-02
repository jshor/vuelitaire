import { ActionContext, ActionTree, MutationTree } from 'vuex'
import IHintsState from '@/interfaces/IHintsState'
import IRootState from '@/interfaces/IRootState'

import generateHints from '@/gameplay/hints'

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
    commit('SET_HINTS', generateHints(rootState.deck))
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
