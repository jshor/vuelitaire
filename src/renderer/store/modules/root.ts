import uuid from 'uuid/v4'
import Vue from 'vue'
import { ActionContext, ActionTree, GetterTree, MutationTree, StoreOptions } from 'vuex'
import cloneDeep from 'lodash.clonedeep'
import autoplay from '../../gameplay/auto'
import ICard from '../../interfaces/ICard'
import IDeckState from '../../interfaces/IDeckState'
import IRootState from '../../interfaces/IRootState'
import Card from '../../models/Card'
import Pair from '../../models/Pair'
import animation from './animation'
import deck from './deck'
import hints from './hints'
import stats from './stats'

const state: IRootState = {
  gameId: uuid(),
  revertibleStates: [],
  selectedCard: null,
  animation: null,
  deck: null,
  hints: null,
  stats: null
}

const getters: GetterTree<IRootState, IRootState> = {
  /**
   * Returns a list of card ids that should be highlighted.
   *
   * @param {IRootState} state
   * @returns {String[]} - list of highlighted card ids
   */
  highlightedCards (state: IRootState): string[] {
    if (state.selectedCard) {
      return [state.selectedCard.id]
    }
    return state.hints.entries[state.hints.index] || []
  },

  /**
   * Returns true if the user can undo their last move.
   *
   * @param {IRootState} state
   */
  canUndo (state: IRootState): boolean {
    return state.revertibleStates.length > 0
  }
}

function wait (ms) {
  return new Promise((resolve, reject) => setTimeout(resolve, ms))
}

const actions: ActionTree<IRootState, IRootState> = {
  /**
   * Initiates a new game.
   *
   * @param {ActionContext<IRootState, IRootState>} context
   * @returns {Promise<void>}
   */
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

  /**
   * Moves the given card from one card to another via the given pairing.
   *
   * @remarks
   *  * This will record a revertible state (i.e., make undoable)
   *  * This will clear all visible hints from the state
   * @param {ActionContext<IRootState, IRootState>} context
   * @param {Pair} pair
   */
  moveCard ({ commit, dispatch }: ActionContext<IRootState, IRootState>, pair: Pair): void {
    dispatch('clearSelection')
    commit('deck/SET_MOVE', pair)
    commit('RECORD_REVERTIBLE_STATE')
    commit('deck/cards/MOVE_CARD', pair)
    commit('deck/REMOVE_FROM_DECK', pair.cardId)
  },

  /**
   * Deals cards from the stock.
   *
   * @remarks
   *  * This will record a revertible state (i.e., make undoable)
   *  * This will clear all visible hints from the state
   * @param {ActionContext<IRootState, IRootState>} context
   */
  async deal ({ commit, dispatch }: ActionContext<IRootState, IRootState>): Promise<void> {
    dispatch('clearSelection')
    commit('deck/SET_MOVE', null)
    commit('RECORD_REVERTIBLE_STATE')
    commit('deck/DEAL')
    await dispatch('animation/wait')
  },

  /**
   * Reverts back to the previous deck state.
   *
   * @remarks This will clear all visible hints from the state
   * @param {ActionContext<IRootState, IRootState>} context
   * @returns {Promise<void>}
   */
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
   * Clears the active card selection.
   *
   * @param {ActionContext<IRootState, IRootState>} context
   */
  clearSelection ({ commit }: ActionContext<IRootState, IRootState>): void {
    commit('SELECT_CARD', null)
    commit('hints/CLEAR_HINTS')
  },

  /**
   * Selects a card. If one is already selected, try to move the previously-selected one onto it.
   *
   * @param {ActionContext<IRootState, IRootState>} context
   * @param {ICard} target
   * @returns {Promise<void>}
   */
  async setSelection (
    { commit, dispatch, state }: ActionContext<IRootState, IRootState>,
    target: ICard
  ): Promise<void> {
    if (state.selectedCard && target.canAcceptCard(state.selectedCard)) {
      const move: Pair = new Pair(state.selectedCard.id, target.id)

      commit('SELECT_CARD', null)

      await dispatch('animation/move', move)
      await dispatch('moveCard', move)
    } else {
      commit('SELECT_CARD', target)
    }
  },

  /**
   * Attempts to auto-play a card. If no moves apply, tell it to 'shake' to inform the user of an error.
   *
   * @param {ActionContext<IRootState, IRootState>} context
   * @param {ICard} card - card to auto-play
   * @returns {Promise<void>}
   */
  async autoplayCard ({ state, commit, dispatch }: ActionContext<IRootState, IRootState>, card: ICard) {
    const pair: Pair = autoplay.findNextMove(state.deck, card)

    if (pair) {
      await dispatch('animation/move', pair)
      await dispatch('moveCard', pair)
    } else {
      commit('deck/cards/SET_CARD_ERROR', { cardId: card.id, hasError: true })
      await dispatch('animation/wait')
      commit('deck/cards/SET_CARD_ERROR', { cardId: card.id, hasError: false })
    }
  },

  /**
   * Continuously promotes cards from the tableaux or waste pile, in an animated fashion.
   * If there are no moves available at the time of invocation, deal again and try again.
   * Do this repeatedly until the score state determines that it's complete.
   *
   * @param {ActionContext<IRootState, IRootState>} context
   * @returns {Promise<void>}
   */
  async autoComplete ({ state, dispatch }: ActionContext<IRootState, IRootState>) {
    const pair: Pair = autoplay.findNextPromotion(state.deck)

    if (pair) {
      await dispatch('animation/move', pair)
      await dispatch('moveCard', pair)
      await dispatch('animation/wait')
    } else {
      await dispatch('deal')
    }

    await dispatch('autoComplete')
  }
}

const mutations: MutationTree<IRootState> = {
  /**
   * Sets the actively-selected card.
   *
   * @param {IRootState} state
   * @param {Card} card - card to select
   */
  SELECT_CARD (state: IRootState, card: Card): void {
    state.selectedCard = card
  },

  /**
   * Resets the existing game data.
   *
   * @param {IRootState} state
   */
  CLEAR_GAME (state: IRootState): void {
    Vue.set(state, 'deck', deck.state)
    Vue.set(state.deck, 'cards', {
      foundations: {},
      tableau: {},
      regular: {}
    })
    Vue.set(state, 'gameId', uuid())
  },

  /**
   * Records the last state so it can be reverted to.
   *
   * @param {IRootState} state
   */
  RECORD_REVERTIBLE_STATE (state: IRootState): void {
    state.revertibleStates.push(cloneDeep(state.deck))
  },

  /**
   * Reverts to the most recent deck state.
   *
   * @param {IRootState} state
   */
  REVERT_TO_PREV_STATE (state: IRootState): void {
    Vue.set(state, 'deck', state.revertibleStates.pop())
  }
}

const strict: boolean = process.env.NODE_ENV !== 'production'

const store: StoreOptions<any> = {
  state,
  getters,
  actions,
  mutations,
  modules: {
    animation,
    deck,
    hints,
    stats
  },
  strict
}

export default store
