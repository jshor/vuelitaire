import { cloneDeep } from 'lodash'
import uuid from 'uuid/v4'
import Vue from 'vue'
import Card from '../models/Card'
import Pair from '../models/Pair'
import animation, { AnimationState } from './animation'
import deck, { DeckState } from './deck/index'
import hints, { HintsState } from './hints'

export class RootState {
  public gameId: string = uuid()
  public revertibleStates: DeckState[] = []
  public selectedCard: Card = null
  public deck: DeckState
  public animation: AnimationState
  public hints: HintsState
}

const state: RootState = new RootState()

const getters = {
  /**
   * Returns a list of card ids that should be highlighted.
   *
   * @param {Object} state
   * @returns {String[]}
   */
  highlightedCards (state): string[] {
    if (state.selectedCard) {
      return [state.selectedCard.id]
    }
    return state.hints.entries[state.hints.index] || []
  },

  canUndo (state): boolean {
    return state.revertibleStates.length > 0
  }
}

function wait (ms) {
  return new Promise((resolve, reject) => setTimeout(resolve, ms))
}

const actions = {
  async newGame ({ commit }): Promise<void> {
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

  moveCard ({ commit }, pair: Pair): void {
    commit('deck/SET_MOVE', pair)
    commit('RECORD_REVERTIBLE_STATE')
    commit('deck/cards/MOVE_CARD', pair)
    commit('deck/REMOVE_FROM_DECK', pair.cardId)
    commit('hints/CLEAR_HINTS')
  },

  deal ({ commit }): void {
    commit('deck/SET_MOVE', null)
    commit('RECORD_REVERTIBLE_STATE')
    commit('deck/DEAL')
    commit('hints/CLEAR_HINTS')
  },

  async undo ({ commit, dispatch }): Promise<void> {
    const prevState: DeckState = state.revertibleStates.slice(-1).pop()

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
  async setSelection ({ commit, dispatch, state }, target): Promise<void> {
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

const mutations = {
  /**
   * Sets the actively-selected card.
   *
   * @param {Object} state
   * @param {Card} card
   */
  SELECT_CARD (state: RootState, card: Card): void {
    state.selectedCard = card
  },

  CLEAR_GAME (state: RootState): void {
    Vue.set(state, 'deck', deck.createState())
    Vue.set(state.deck, 'cards', {})
    Vue.set(state, 'gameId', uuid())
  },

  RECORD_REVERTIBLE_STATE (state: RootState): void {
    state.revertibleStates.push(cloneDeep(state.deck))
  },

  REVERT_TO_PREV_STATE (state: RootState): void {
    Vue.set(state, 'deck', state.revertibleStates.pop())
  }
}

export default {
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
