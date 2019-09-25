import getMoveableCardHints from '../../hints/getMoveableCardHints'
import getRevealableCardHints from '../../hints/getRevealableCardHints'

const state = {
  entries: [],
  index: -1
}

const getters = {
  hint (state) {
    return state.entries[state.index] || []
  }
}

const actions = {
  showHint ({ commit, dispatch, state }) {
    if (state.entries.length === 0) {
      // if we have no hints for this state yet, generate them
      dispatch('generateHints')
    }
    commit('SHOW_NEXT_HINT')
  },

  generateHints ({ rootState, commit }) {
    const cards = Object.values(rootState.cards)
    const topWasteCard = rootState.deck.waste.slice(-1)

    commit('SET_HINTS', [
      ...getRevealableCardHints(cards),
      ...getMoveableCardHints(cards, topWasteCard),
      // the last hint in the list will always be to deal
      'DEAL_CARD'
    ])
  }
}

const mutations = {
  'SET_HINTS' (state, hints) {
    hints.forEach(hint => state.entries.push(hint))
  },

  'CLEAR_HINTS' (state) {
    state.entries = []
    state.index = -1
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
  getters,
  actions,
  mutations
}
