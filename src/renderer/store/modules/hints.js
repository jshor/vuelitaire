import {
  getMoveableCardHints,
  getLaneCreationHints,
  getDestructuringLaneHints,
  getDeckHints,
  getWorryBackHints
} from '../../gameplay'

const state = {
  entries: [],
  index: -1
}

const actions = {
  showHint ({ commit, dispatch, state }) {
    if (state.entries.length === 0) {
      // if we have no hints for this state yet, generate them
      dispatch('generateHints')
    }

    // TODO: show electron dialog if there are still no hints

    commit('SHOW_NEXT_HINT')
  },

  generateHints ({ rootState, commit }) {
    const { cards, waste } = rootState.deck
    const allCards = Object.values(cards)
    const playableCards = allCards
      .filter(card => card.isPlayable() && !card.promoted)
      .concat(waste.slice(-1))

    // generate basic hints
    const hints = [
      ...getMoveableCardHints(allCards, playableCards),
      ...getLaneCreationHints(allCards, playableCards),
      ...getDeckHints(allCards, rootState.deck)
    ]

    // if there were no hints available, try the "desperate" hints
    if (hints.length === 0) {
      hints.push(getDestructuringLaneHints(allCards))
      hints.push(getWorryBackHints(allCards, rootState.deck))
    }

    commit('SET_HINTS', hints)
  }
}

const mutations = {
  CLEAR_HINTS (state) {
    state.entries = []
    state.index = -1
  },

  'SET_HINTS' (state, hints) {
    hints.forEach(hint => state.entries.push(hint))
  },

  'SHOW_NEXT_HINT' (state) {
    state.index++

    if (state.index >= state.entries.length) {
      // if we're all out of hints, show the first hint again
      state.index = 0
    }
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
