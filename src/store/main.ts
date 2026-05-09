import { defineStore } from 'pinia'
import { shuffle } from 'lodash-es'
import { Card } from '@/types/Card'
import { createCard } from '@/models/Card'
import { State, state } from './state'
import { MoveType } from '@/types/enums/MoveType'
import { Move } from '@/types/Move'
import { createSettings } from '@/models/Settings'
import { Settings } from '@/types/Settings'
import { Scoring, Suits } from '@/constants'
import { generateHints } from '@/gameplay/hints'
import { isBuildable } from '@/gameplay/rules/isBuildable'
import { isKing } from '@/gameplay/rules/isKing'
import { hasSameSuitAfterPromotion } from '@/gameplay/rules/hasSameSuitAfterPromotion'
import { isAce } from '@/gameplay/rules/isAce'

export const useStore = defineStore('store', {
  state,
  getters: {
    /** True if a move can be undone. */
     canUndo (state: State): boolean {
      return state.undoStack.length > 0
    },

    /** True if the game can be autocompleted. */
    canAutocomplete(state: State): boolean {
      if (state.stock.length === 0) {
        return Object
          .values(state.cards)
          .every(card => card.revealed)
      }

      return false
    },

    /** True if the game is complete (nothing left in the tableau). */
    isComplete(state: State): boolean {
      if (state.dealSpace.child) return false

      return Object
        .values(state.tableau)
        .every(tableau => !tableau.child)
    },

    /** Returns the current hint. */
    currentHint(state: State): string[] {
      return state.hints[state.currentHintIndex] || []
    },

    /** True if there are cards in the stock. */
    hasStockCards(state: State): boolean {
      return state.stock.length > 0 || false
    }
  },
  actions: {
    /**
     * Starts a new game.
     */
    newGame() {
      this.stop()
      this.cards = {}
      this.stock = []
      this.tableau = {}
      this.foundations = {}
      this.points = 0
      this.offset = 0
      this.dealIndex = -1
      this.undoStack = []
      this.clearSelections()
      this.createStock()
      this.initTableau()
      this.initFoundations()
      this.start()
    },

    /**
     * Initializes the stock pile (52 cards, shuffled).
     */
    createStock () {
      const createSuit = (suit: string): Card[] => Array(13)
        .fill(null)
        .map((_, rank: number): Card => createCard({ suit, rank, revealed: true }))

      const stock: Card[] = [
        ...createSuit(Suits.SPADES),
        ...createSuit(Suits.HEARTS),
        ...createSuit(Suits.DIAMONDS),
        ...createSuit(Suits.CLUBS)
      ]

      this.cards[this.dealSpace.id] = this.dealSpace

      shuffle(stock).forEach((card: Card): void => {
        this.stock.push(card)
        this.cards[card.id] = card
      })
    },

    /**
     * Initializes the tableau.
     */
    initTableau () {
      for (let i = 1; i <= 7; i++) {
        let parent: Card = createCard({
          revealed: true,
          rules: [isBuildable, isKing],
          type: 'LaneSpace'
        })

        // add the lane space to the list of cards
        this.cards[parent.id] = parent

        // assign the first lane space card to the tableau row
        this.tableau[parent.id] = parent

        // move the last n cards from the stock pile to the tableau
        this
          .stock
          .splice(this.stock.length - i, i)
          .forEach(card => {
            // assign the next card to be the child of the previous card
            parent.child = card
            card.parent = parent
            parent = card
            card.revealed = false
          })

        parent.revealed = true
      }
    },

    /**
     * Initializes the foundation spaces.
     */
    initFoundations() {
      for (let i = 0; i < Object.values(Suits).length; i++) {
        const foundation = createCard({
          suit: Object.values(Suits)[i],
          promoted: true,
          revealed: true,
          rules: [isBuildable, isAce, hasSameSuitAfterPromotion],
          type: 'FoundationSpace'
        })

        this.cards[foundation.id] = foundation
        this.foundations[foundation.id] = foundation
      }
    },

    /**
     * Starts the game timer.
     */
    start() {
      if (this.isStopped) {
        this.isStopped = false
        this.tick()
      }
    },

    /**
     * Ticks the game timer, applying time penalties and bonuses as necessary.
     */
    tick(lastTickTime = Date.now()) {
      if (this.isStopped) return

      if (lastTickTime < Date.now()) {
        // compute the number of seconds elapsed since the last tick, plus any offset from pausing
        this.seconds = this.offset + Math.ceil((Date.now() - lastTickTime) / 1000)
      }

      if (this.lastDeductionTime + Scoring.TIME_PENALTY_MS <= this.seconds) {
        this.deductByEpoch(1)
        this.lastDeductionTime = this.seconds
      }

      if (this.isComplete) {
        // the game is won - apply the bonus and stop the timer
        this.stop()
        this.computeBonus(this.seconds)
      }

      requestAnimationFrame(this.tick.bind(this, lastTickTime))
    },

    /**
     * Stops the game timer.
     */
    stop() {
      this.isStopped = true
      this.offset = this.seconds
    },

    /**
     * Adds the given number of points to the current score.
     * Use a negative value to deduct points.
     */
    applyPoints(points: number) {
      this.points = Math.max(this.points + points, 0)
    },

    /**
     * Applies a time penalty for the given number of elapsed scoring epochs.
     */
    deductByEpoch(epochs: number) {
      this.applyPoints(epochs * Scoring.TIME_PENALTY_POINTS)
    },

    /**
     * Applies a completion bonus based on elapsed seconds.
     * No bonus is awarded for completions under 30 seconds.
     */
    computeBonus(seconds: number) {
      if (seconds >= 30) {
        this.applyPoints(Math.ceil((20000 / seconds) * 35))
      }
    },

    /**
     * Clears all selections and temporary states related to hints, errors, and teleportation.
     */
    clearSelections () {
      this.hotspots = []
      this.hints = []
      this.currentHintIndex = -1
      this.draggedCardId = undefined
      this.hoveredCardId = undefined
      this.selectedCardId = undefined
      this.errorCardId = undefined
      this.teleportation = undefined
    },

    /**
     * Undoes the last move.
     */
    undo() {
      this.clearSelections()

      const move = this.undoStack.pop()

      switch (move?.type) {
        case MoveType.MOVE:
          return this.unmoveCard(move)
        case MoveType.DEAL:
          return this.undeal(move)
        default:
          return
      }
    },

    /**
     * Moves a card from its current parent to another.
     */
    moveCard(fromId: string, toId: string) {
      this.clearSelections()
      this.teleportation = { fromId, toId }
    },

    /**
     * Undoes a card move by moving the card back to its original parent.
     */
    unmoveCard(move: Move<MoveType.MOVE>) {
      this.clearSelections()
      this.isUndoing = true

      if (move.fromId === this.dealSpace.id) {
        this.dealIndex++
        // set a temporary placeholder card to maintain indices
        this.stock.splice(this.dealIndex, 0, createCard({ revealed: true }))
        this.setDeal()
      }

      this.moveCard(move.cardId, move.fromId)
      this.cards[move.fromId].revealed = !move.revealed
    },

    /**
     * Deals cards from the stock pile to the deal space.
     * Resets the stock pile once there are no cards left to deal.
     */
    deal() {
      const removePlaceholder = () => {
        const jokerIndex = this.stock.findIndex(card => card.rank === -1)

        if (jokerIndex !== -1) {
          this.stock.splice(jokerIndex, 1)
          removePlaceholder()
        }
      }

      removePlaceholder()

      if (this.dealIndex >= this.stock.length) {
        this.dealIndex = -1
      }

      this.dealIndex += this.settings.dealCount

      this.setDeal()
      this.undoStack.push({
        type: MoveType.DEAL,
        index: this.dealIndex - this.settings.dealCount
      })
    },

    /**
     * Undo of the last deal.
     */
    undeal(move: Move<MoveType.DEAL>) {
      this.dealIndex = move.index
      this.setDeal()
    },

    /**
     * Ensures that the only stock/waste cards revealed are ones dealt.
     */
    setDeal() {
      this.clearSelections()

      if (this.stock[this.dealIndex]) {
        this.dealSpace.child = this.stock[this.dealIndex]
        this.stock[this.dealIndex].parent = this.dealSpace
      } else {
        this.dealSpace.child = undefined
      }
    },

    /**
     * Reveals a game hint for the next moves.
     */
    revealHint () {
      this.hints = generateHints(this.$state)

      if (this.hints.length === 0) {
        return
      }

      if (this.currentHintIndex++ >= this.hints.length - 1) {
        this.currentHintIndex = 0
      }
    },

    /**
     * Adopts a card to a new parent.
     */
    adoptNewCard(cardId: string, nextParentId: string) {
      this.clearSelections()

      const currentParentId = this.cards[cardId].parent?.id

      if (currentParentId === nextParentId) {
        return
      }

      if (currentParentId) {
        if (!this.isUndoing) {
          this.undoStack.push({
            type: MoveType.MOVE,
            cardId,
            fromId: currentParentId,
            toId: nextParentId,
            revealed: !this.cards[currentParentId]?.revealed
          })
        }

        this.cards[currentParentId].revealed = true
        this.cards[currentParentId].child = undefined
      }

      if (this.isUndoing) {
        this.restoreToStock(cardId, nextParentId)
      } else {
        this.removeFromStock(cardId)
      }

      this.cards[cardId].parent = this.cards[nextParentId]
      this.cards[cardId].promoted = this.cards[nextParentId].promoted
      this.cards[nextParentId].child = this.cards[cardId]
      this.isUndoing = false

      if (this.isAutoplaying) {
        this.autoplayGame()
      }
    },

    /**
     * Returns the given card to the stock if being moved back into it.
     */
    restoreToStock(cardId: string, nextParentId: string) {
      if (nextParentId === this.dealSpace.id) {
        this.stock[this.dealIndex] = this.cards[cardId] // restore card to stock
        this.cards[this.stock[this.dealIndex].id] = this.stock[this.dealIndex]
        this.dealSpace.child = this.stock[this.dealIndex]
      }
    },

    /**
     * Removes the given card out of the stock if being moved out of it.
     */
    removeFromStock(cardId: string) {
      const stockIndex = this.stock.findIndex(card => card.id === cardId)

      if (stockIndex !== -1) {
        // add a placeholder card to maintain indices
        this.stock[stockIndex] = createCard()
        this.cards[this.stock[stockIndex].id] = this.stock[stockIndex]
        this.dealSpace.child = this.stock[stockIndex]

        // then go back one index to account for the removed card
        this.dealIndex--
        this.setDeal()
      }
    },

    /**
     * Autoplays the next move of the card if possible.
     * Otherwise, sets an error state on the card.
     */
    autoplayCard(cardId: string) {
      this.clearSelections()

      const hint = generateHints(this.$state, true)
        .reverse() // TODO: most valuable hints are at the end of the list?
        .find(([ sourceId ]) => {
          return sourceId === cardId
        })

      if (hint) {
        this.moveCard(hint[0], hint[1])
      } else {
        this.errorCardId = cardId
      }
    },

    /**
     * Autoplays all remaining cards in the tableau.
     */
    async autoplayGame() {
      if (this.isComplete || !this.canAutocomplete) return

      this.clearSelections()
      this.isAutoplaying = true

      const [ sourceId, targetId ] = generateHints(this.$state)
        .filter(cards => cards.length === 2)
        .pop() || []

      if (!sourceId || !targetId) {
        return
      }

      setTimeout(() => {
        this.moveCard(sourceId, targetId)
      })
    },

    /**
     * Applies settings from localStorage. Falls back to default settings if not applicable.
     */
    loadLocalStorageSettings (): void {
      const settings = createSettings()

      try {
        const data = localStorage.getItem('settings')

        if (data) {
          Object.assign(settings, JSON.parse(data))
        }
      } catch (_) {
        // do nothing, we ignore the error
      }

      Object.assign(this.settings, settings)
    },

    /**
     * Updates settings in localStorage and on the state.
     */
    updateSettings (settings: Partial<Settings>): void {
      Object.assign(this.settings, settings)
      localStorage.setItem('settings', JSON.stringify(this.settings))
    },

    /**
     * Toggles the modal for settings.
     */
    toggleDialog (showDialog: boolean): void {
      this.updateSettings({ showDialog })
    }
  }
})
