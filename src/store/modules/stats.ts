import { Scoring } from '@/constants'
import scoring from '@/gameplay/scoring'
import winning from '@/gameplay/winning'
import IRootState from '@/interfaces/IRootState'
import IStatsState from '@/interfaces/IStatsState'
import Pair from '@/models/Pair'
import { ActionContext, ActionTree, Module, MutationTree } from 'vuex'

const state: IStatsState = {
  points: 0,
  paused: false,
  isComplete: false,
  canAutocomplete: false
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
  },

  /**
   * Computes the bonus awarded to the player based on seconds elapsed.
   *
   * @param {ActionContext<IRootState, IRootState>} context
   * @param {number} secondsElapsed
   */
  computeBonus ({ commit }: ActionContext<IStatsState, IRootState>, secondsElapsed: number): void {
    const bonusPoints: number = scoring.bonus(secondsElapsed)

    commit('UPDATE_POINTS', bonusPoints)
  },

  /**
   * Deducts points after the stock is dealt to its end.
   *
   * @param {ActionContext<IRootState, IRootState>} context
   */
  deductByDeal ({ commit, rootState }: ActionContext<IStatsState, IRootState>): void {
    const deduction: number = scoring.dealDeduction(rootState.deck)

    commit('UPDATE_POINTS', deduction)
  },

  /**
   * Accrues points according to the given move.
   *
   * @param {ActionContext<IRootState, IRootState>} context
   * @param {Pair} move - last move made
   */
  accruePointsByMove ({ commit, rootState }: ActionContext<IStatsState, IRootState>, move: Pair): void {
    const points: number = scoring.cardMove(move, rootState.deck)

    commit('UPDATE_POINTS', points)
  },

  /**
   * Determines whether or not the user can either autocomplete or has won the game.
   *
   * @param {ActionContext<IRootState, IRootState>} context
   * @param {Pair} move - last move made
   */
  determineWinningStatus ({ commit, rootState }: ActionContext<IStatsState, IRootState>, move: Pair): void {
    if (winning.isWinningMove(move, rootState.deck)) {
      // user has won!
      commit('SET_IS_WINNING', true)
    } else if (winning.canAutocomplete(rootState.deck)) {
      // user hasn't won yet, but they can autocomplete now
      commit('SET_CAN_AUTOCOMPLETE', true)
    }
  }
}

const mutations: MutationTree<IStatsState> = {
  RESET_STATS (state: IStatsState) {
    state.points = 0
    state.paused = false
    state.isComplete = false
    state.canAutocomplete = false
  },

  /**
   * Accrues points with the given value.
   *
   * @param {IStatsState} state
   * @param {number} points
   */
  UPDATE_POINTS (state: IStatsState, points) {
    state.points = Math.max(state.points + points, 0)
  },

  /**
   * Sets the `isWinning` state flag.
   *
   * @param {IStatsState} state
   * @param {boolean} isComplete
   */
  SET_IS_WINNING (state: IStatsState, isComplete: boolean) {
    state.isComplete = isComplete
  },

  /**
   * Sets the `canAutocomplete` state flag.
   *
   * @param {IStatsState} state
   * @param {boolean} canAutocomplete
   */
  SET_CAN_AUTOCOMPLETE (state: IStatsState, canAutocomplete: boolean) {
    state.canAutocomplete = canAutocomplete
  }
}

const stats: Module<IStatsState, IRootState> = {
  namespaced: true,
  state,
  mutations,
  actions
}

export default stats
