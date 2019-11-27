import { ActionContext, ActionTree, GetterTree, MutationTree, StoreOptions } from 'vuex'
import { cloneDeep } from 'lodash'
import uuid from 'uuid/v4'
import Vue from 'vue'
import Card from '../../models/Card'
import Pair from '../../models/Pair'
import animation from './animation'
import deck from './deck'
import hints from './hints'
import ICard from '../../interfaces/ICard'
import IDeckState from '../../interfaces/IDeckState'
import IRootState from '../../interfaces/IRootState'

const state: IRootState = {
  gameId: uuid(),
  revertibleStates: [],
  selectedCard: null,
  animation: null,
  deck: null,
  hints: null
}

const getters: GetterTree<IRootState, IRootState> = {
  /**
   * Returns a list of card ids that should be highlighted.
   *
   * @param {Object} state
   * @returns {String[]}
   */
  highlightedCards (state: IRootState): string[] {
    if (state.selectedCard) {
      return [state.selectedCard.id]
    }
    return state.hints.entries[state.hints.index] || []
  },

  canUndo (state: IRootState): boolean {
    return state.revertibleStates.length > 0
  }
}

function wait (ms) {
  return new Promise((resolve, reject) => setTimeout(resolve, ms))
}

const actions: ActionTree<IRootState, IRootState> = {
  async newGame ({ commit }: ActionContext<IRootState, IRootState>): Promise<void> {
    commit('CLEAR_GAME')
    commit('animation/SET_IN_PROGRESS', true)
    commit('deck/INIT_DECK')
    commit('deck/INIT_TABLEAU')
    commit('deck/cards/INIT_FOUNDATIONS')
    commit('deck/cards/REVEAL_CARDS')

    // wait for the initial load animation to complete
    await wait(35 * 50) // 35 cards at 50 ms each

    commit('deck/cards/CLEAR_ANIMATION_INDICES')
    commit('animation/SET_IN_PROGRESS', false)
  },

  moveCard ({ commit }: ActionContext<IRootState, IRootState>, pair: Pair): void {
    commit('deck/SET_MOVE', pair)
    commit('RECORD_REVERTIBLE_STATE')
    commit('deck/cards/MOVE_CARD', pair)
    commit('deck/REMOVE_FROM_DECK', pair.cardId)
    commit('hints/CLEAR_HINTS')
  },

  deal ({ commit }: ActionContext<IRootState, IRootState>): void {
    commit('deck/SET_MOVE', null)
    commit('RECORD_REVERTIBLE_STATE')
    commit('deck/DEAL')
    commit('hints/CLEAR_HINTS')
  },

  async undo ({ commit, dispatch, state }: ActionContext<IRootState, IRootState>): Promise<void> {
    const prevState: IDeckState = state.revertibleStates.slice(-1).pop()

    if (prevState && prevState.move) {
      commit('deck/cards/UNREVEAL_CARD', prevState.move.parentId)
      await dispatch('animation/reverse', prevState.move)
    }
    commit('REVERT_TO_PREV_STATE')
    commit('hints/CLEAR_HINTS')
  },

  /**
   * Selects a card. If one is already selected, try to move the previously-selected one onto it.
   *
   * @param {Vuex} store
   * @param {Card} target
   * @returns {Promise}
   */
  async setSelection ({ commit, dispatch, state }: ActionContext<IRootState, IRootState>, target: ICard): Promise<void> {
    if (state.selectedCard && target.canAcceptCard(state.selectedCard)) {
      const move: Pair = new Pair(state.selectedCard.id, target.id)

      commit('SELECT_CARD', null)

      await dispatch('animation/move', move)
      await dispatch('moveCard', move)
    } else {
      commit('SELECT_CARD', target)
    }
  },

  clearSelection ({ commit }): void {
    commit('SELECT_CARD', null)
  }
}

const mutations: MutationTree<IRootState> = {
  /**
   * Sets the actively-selected card.
   *
   * @param {Object} state
   * @param {Card} card
   */
  SELECT_CARD (state: IRootState, card: Card): void {
    state.selectedCard = card
  },

  CLEAR_GAME (state: IRootState): void {
    Vue.set(state, 'deck', deck.state)
    Vue.set(state.deck, 'cards', {})
    Vue.set(state, 'gameId', uuid())
  },

  RECORD_REVERTIBLE_STATE (state: IRootState): void {
    state.revertibleStates.push(cloneDeep(state.deck))
  },

  REVERT_TO_PREV_STATE (state: IRootState): void {
    Vue.set(state, 'deck', state.revertibleStates.pop())
  }
}

const store: StoreOptions<any> = {
  state,
  getters,
  actions,
  mutations,
  modules: {
    animation,
    deck,
    hints
  }
}

export default store
