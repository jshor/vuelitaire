import { ActionContext, ActionTree, Module, MutationTree } from 'vuex'
import IRootState from '../../interfaces/IRootState'
import IStatsState from '../../interfaces/IStatsState'
import { Scoring } from '../../constants'

const state: IStatsState = {
  points: 0,
  paused: false,
  isComplete: false
}

const actions: ActionTree<IStatsState, IRootState> = {
  /**
   * Deducts points according to the number of given epochs.
   *
   * @see Scoring.TIME_PENALTY_POINTS for the number of seconds in one epoch.
   *
   * @param {ActionContext<IRootState, IRootState>} context
   * @param {number} epochs
   */
  deductByEpoch ({ commit }: ActionContext<IStatsState, IRootState>, epochs: number): void {
    const deduction: number = epochs * Scoring.TIME_PENALTY_POINTS

    commit('UPDATE_POINTS', deduction)
  }
}

const mutations: MutationTree<IStatsState> = {
  /**
   * Accrues points with the given value.
   *
   * @param {IStatsState} state
   * @param {number} points
   */
  UPDATE_POINTS (state: IStatsState, points: number = 0) {
    state.points += points
  }
}

const stats: Module<IStatsState, IRootState> = {
  namespaced: true,
  state,
  mutations,
  actions
}

export default stats
