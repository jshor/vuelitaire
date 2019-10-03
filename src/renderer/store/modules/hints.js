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
    const allCards = Object.values(rootState.cards)
    const playableCards = allCards
      .filter(card => card.isPlayable() && !card.promoted)
      .concat(rootState.deck.waste.slice(-1))

    commit('SET_HINTS', [
      ...getMoveableCardHints(allCards, playableCards),
      ...getLaneCreationHints(allCards, playableCards),
      ...getDeckHints(allCards, rootState.deck),
      ...getDestructuringLaneHints(allCards),
      ...getWorryBackHints(allCards, rootState.deck)
    ])
  }
}

const mutations = {
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
  state,
  actions,
  mutations
}
