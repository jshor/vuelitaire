import IAnimationState from '@/interfaces/IAnimationState'
import IRootState from '@/interfaces/IRootState'
import Pair from '@/models/Pair'
import { ActionContext, ActionTree, MutationTree } from 'vuex'

const state: IAnimationState = {
  cardId: null, // the card being moved
  targetId: null, // the card to place onto
  parentId: null, // the previous parent of `cardId`
  inProgress: false
}

const actions: ActionTree<IAnimationState, IRootState> = {
  /**
   * Animates a move that is reversed from the given state.
   * A reversed move is one where the target of the moved card reverts to its original parent.
   *
   * @param {ActionContext<IAnimationState, IRootState>} context
   * @param {Pair} prevMove - the move to reverse
   * @returns {Promise}
   */
  async reverse ({ dispatch }: ActionContext<IAnimationState, IRootState>, prevMove: Pair): Promise<void> {
    const nextMove: Pair = Object.assign(new Pair(), prevMove)

    // make the the previous parent to be the new target
    nextMove.targetId = nextMove.parentId

    await dispatch('move', nextMove)
  },

  /**
   * Animates a card to move from one parent to another.
   *
   * @param {ActionContext<IAnimationState, IRootState>} context
   * @param {Pair} move - pairing to assign marriage to
   */
  async move ({ commit, dispatch }: ActionContext<IAnimationState, IRootState>, move: Pair): Promise<void> {
    commit('SET_ANIMATION', move)
    await dispatch('wait')
    commit('SET_ANIMATION', new Pair()) // now that the animation is complete, we can reset
  },

  /**
   * Halts user interaction for the specified time to elapse (in milliseconds).
   *
   * @param {ActionContext<IAnimationState, IRootState>} context
   * @param {number} [time = 250] - time, in milliseconds, to halt
   * @returns {Promise<void>}
   */
  wait ({ commit }: ActionContext<IAnimationState, IRootState>, time: number = 250): Promise<void> {
    commit('SET_IN_PROGRESS', true)

    return new Promise((resolve): void => {
      window.setTimeout((): void => {
        commit('SET_IN_PROGRESS', false)
        resolve()
      }, time)
    })
  }
}

const mutations: MutationTree<IAnimationState> = {
  /**
   * Sets the animation target and card ids.
   *
   * @param {IAnimationState} state
   * @param {Pair} move - card pairing to animate
   */
  SET_ANIMATION (state: IAnimationState, move: Pair): void {
    state.cardId = move.cardId
    state.targetId = move.targetId
    state.parentId = move.parentId
  },

  /**
   * Sets whether an animation is in progress or not.
   *
   * @param {IAnimationState} state
   * @param {Boolean} inProgress - whether or not the animation is in progress
   */
  SET_IN_PROGRESS (state: IAnimationState, inProgress: boolean): void {
    state.inProgress = inProgress
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
