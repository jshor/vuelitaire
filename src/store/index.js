import Vue from 'vue'
import Vuex from 'vuex'
import cards from './modules/cards'
import deck from './modules/deck'

Vue.use(Vuex)

const state = {
  promotions: [],
  deckIndex: -1
}

const actions = {
  newGame ({ commit, state }) {
    commit('INIT_DECK')
    commit('REGISTER_CARDS', state.deck.cards)
    commit('INIT_TABLEAU', state.deck.cards)
    commit('INIT_FOUNDATIONS')
    // commit('REVEAL_CARDS')
  },

  moveCard ({ commit }, { cardId, targetId }) {
    console.log('move: ', cardId, targetId)
    commit('REMOVE_FROM_DECK', cardId)
    commit('MOVE_CARD', { cardId, targetId })
  }
}

const mutations = {
  REVEAL_CARDS (state) {
    // make all deck cards revealable
    state.deck.forEach(({ id }) => {
      Vue.set(state.cards[id], 'revealed', true)
    })

    // turn over the last cards in the tableau
    // state.tableau.forEach((list, index) => {
    //   Vue.set(state.cards[list[index].id], 'revealed', true)
    // })
  }
}

export default new Vuex.Store({
  state,
  actions,
  mutations,
  modules: {
    cards,
    deck
  }
})
