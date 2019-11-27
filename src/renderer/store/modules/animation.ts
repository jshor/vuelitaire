import { ActionTree, MutationTree, ActionContext } from 'vuex'
import IAnimationState from '../../interfaces/IAnimationState'
import IRootState from '../../interfaces/IRootState'
import Pair from '../../models/Pair'

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
   * @param {Vuex} store
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
   * @param {Vuex} store
   * @param {IAnimationState} animation
   */
  move ({ commit }: ActionContext<IAnimationState, IRootState>, move: Pair): Promise<void> {
    commit('SET_IN_PROGRESS', true)
    commit('SET_ANIMATION', move)

    return new Promise((resolve): void => {
      setTimeout((): void => {
        // now that the animation is complete, we can reset
        commit('SET_ANIMATION', new Pair())
        commit('SET_IN_PROGRESS', false)
        resolve()
      }, 250) // TODO: make const
    })
  }
}

const mutations: MutationTree<IAnimationState> = {
  /**
   * Sets the animation target and card ids.
   *
   * @param {Object} state
   * @param {Pair} animation
   */
  SET_ANIMATION (state: IAnimationState, move: Pair): void {
    state.cardId = move.cardId
    state.targetId = move.targetId
    state.parentId = move.parentId
  },

  /**
   * Sets whether an animation is in progress or not.
   *
   * @param {Object} state
   * @param {Boolean} inProgress
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
