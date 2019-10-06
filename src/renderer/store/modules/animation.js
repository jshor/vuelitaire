import Pair from '../models/Pair'

const state = {
  cardId: null, // the card being moved
  targetId: null, // the card to place onto
  inProgress: false
}

const actions = {
  /**
   * Animates a move that is reversed from the given state.
   * A reversed move is one where the target of the moved card reverts to its original parent.
   *
   * @param {Vuex} store
   * @param {Object} state
   * @param {Pair} state.move
   * @returns {Promise}
   */
  async reverse ({ dispatch }, { move }) {
    if (move) {
      const pair = new Pair(move.cardId, move.parentId)

      await dispatch('move', pair)
    }
  },

  /**
   * Animates a card to move from one parent to another.
   *
   * @param {Vuex} store
   * @param {Pair} move
   */
  move ({ commit }, move) {
    commit('SET_IN_PROGRESS', true)
    commit('SET_ANIMATION', move)

    return new Promise((resolve) => {
      setTimeout(() => {
        // now that the animation is complete, we can reset
        commit('SET_ANIMATION', new Pair())
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
  SET_ANIMATION (state, animation) {
    state.cardId = animation.cardId
    state.targetId = animation.targetId
  },

  /**
   * Sets whether an animation is in progress or not.
   *
   * @param {Object} state
   * @param {Boolean} inProgress
   */
  SET_IN_PROGRESS (state, inProgress) {
    state.inProgress = inProgress
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
