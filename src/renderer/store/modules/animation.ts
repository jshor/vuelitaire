import Pair from '../models/Pair'

export class AnimationState {
  public cardId: string = null // the card being moved
  public targetId: string = null // the card to place onto
  public parentId: string = null // the previous parent of `cardId`
  public inProgress: boolean = false
}

const state: AnimationState = new AnimationState()

const actions = {
  /**
   * Animates a move that is reversed from the given state.
   * A reversed move is one where the target of the moved card reverts to its original parent.
   *
   * @param {Vuex} store
   * @param {AnimationState} animation
   * @returns {Promise}
   */
  async reverse ({ dispatch }, prevMove: Pair): Promise<void> {
    const nextMove: Pair = Object.assign(new Pair(), prevMove)

    // make the the previous parent to be the new target
    nextMove.targetId = nextMove.parentId

    await dispatch('move', nextMove)
  },

  /**
   * Animates a card to move from one parent to another.
   *
   * @param {Vuex} store
   * @param {AnimationState} animation
   */
  move ({ commit }, move: Pair): Promise<void> {
    commit('SET_IN_PROGRESS', true)
    commit('SET_ANIMATION', move)

    return new Promise((resolve): void => {
      setTimeout((): void => {
        // now that the animation is complete, we can reset
        commit('SET_ANIMATION', new AnimationState())
        commit('SET_IN_PROGRESS', false)
        resolve()
      }, 250) // TODO: make const
    })
  }
}

const mutations = {
  /**
   * Sets the animation target and card ids.
   *
   * @param {Object} state
   * @param {Pair} animation
   */
  SET_ANIMATION (state: AnimationState, move: Pair): void {
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
  SET_IN_PROGRESS (state: AnimationState, inProgress: boolean): void {
    state.inProgress = inProgress
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
