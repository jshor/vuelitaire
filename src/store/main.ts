import { defineStore } from 'pinia'
import { shuffle } from 'lodash-es'
import { Card } from '@/types/Card'
import { createLaneSpace } from '@/models/LaneSpace'
import { ICard } from '@/interfaces/ICard'
import { createCard } from '@/models/Card'
import { createFoundationSpace } from '@/models/FoundationSpace'
import { State, state } from './state'
import { MoveType } from '@/types/enums/MoveType'
import { Move } from '@/types/Move'
import { createSettings } from '@/models/Settings'
import { Settings } from '@/types/Settings'
import { Scoring, Suits } from '@/constants'
import { generateHints } from '@/gameplay/hints'
import { getLineage } from '@/utils/getLineage'
import { bonus } from '@/gameplay/scoring'

export const useStore = defineStore('store', {
  state,
  getters: {
    /** True if a move can be undone. */
     canUndo (state: State): boolean {
      return state.undoStack.length > 0
    },

    /** True if the game can be autocompleted. */
    canAutocomplete(state: State): boolean {
      if (state.stock.length + state.waste.length === 0) {
        return !state.dealSpace.child && Object
          .values(state.cards)
          .every(card => card.revealed)
      }

      return false
    },

    /** True if the game is complete. */
    isComplete(state: State): boolean {
      return !state.dealSpace.child && Object
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
      this.cards = {}
      this.stock = []
      this.waste = []
      this.tableau = {}
      this.foundations = {}
      this.points = 0
      this.undoStack = []
      this.clearSelections()
      this.createStock()
      this.initTableau()
      this.initFoundations()
    },

    /**
     * Initializes the stock pile (52 cards, shuffled).
     */
    createStock () {
      const createSuit = (suit: string): Card[] => Array(13)
        .fill(null)
        .map((_, rank: number): Card => createCard({ suit, rank }))

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
      let index = 0 // temp

      for (let i = 1; i <= 7; i++) {
        let parent: ICard = createLaneSpace()

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
            card.index = index++
          })

        parent.revealed = true
      }
    },

    /**
     * Initializes the foundation spaces.
     */
    initFoundations() {
      for (let i = 0; i < Object.values(Suits).length; i++) {
        const foundation = createFoundationSpace(Object.values(Suits)[i])

        this.cards[foundation.id] = foundation
        this.foundations[foundation.id] = foundation
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
      this.moveCard(move.cardId, move.fromId)
      this.cards[move.fromId].revealed = !move.revealed
    },

    /**
     * Deals cards from the stock pile to the deal space.
     * Resets the stock pile once there are no cards left to deal.
     */
    deal() {
      let parent: ICard | undefined = this.dealSpace.child
      const wastedCardIds: string[] = []

      if (this.stock.length === 0 && !parent) {
        // all cards dealt - reset the stock with the waste pile
        this.stock = this.waste
        this.waste = []
      }

      while (parent) {
        const wastedCard = parent.child

        if (wastedCard) {
          // orphan the child from the dealt lineage
          parent.child = undefined
          wastedCard.parent = undefined
        }

        // move the card to the waste pile
        this.waste.unshift(parent)
        wastedCardIds.push(parent.id)
        parent = wastedCard
      }

      parent = this.dealSpace

      for (let i = 0; i < this.settings.dealCount; i++) {
        if (parent) {
          const stockCard = this.stock.pop()

          if (stockCard) {
            stockCard.parent = parent
          }

          parent.child = stockCard
          parent = parent.child
        }
      }

      this.undoStack.push({ type: MoveType.DEAL, wastedCardIds })
      this.setDealReveal()
      this.clearSelections()
    },

    /**
     * Undo of the last deal.
     */
    undeal(move: Move<MoveType.DEAL>) {
      let parent: ICard | undefined = this.dealSpace

      // return all currently-dealt cards to the stock
      while (parent) {
        const stockCard: Card | undefined = parent.child

        if (stockCard) {
          // orphan the child from the dealt lineage
          parent.child = undefined
          stockCard.parent = undefined

          // move the card back to the stock pile
          this.stock.push(stockCard)
        }

        parent = stockCard
      }

      // start over, with the deal space being the new parent
      parent = this.dealSpace
      parent.child = undefined

      // fetch the cards out of the waste pile
      for (let i = 0; i < move.wastedCardIds.length; i++) {
        const wastedCard = this.cards[move.wastedCardIds[i]]

        // have the parent adopt the previously-wasted card
        parent.child = wastedCard
        wastedCard.parent = parent
        wastedCard.child = undefined
        parent = wastedCard
      }

      this.setDealReveal()
      this.clearSelections()
    },

    /**
     * Ensures that the only stock/waste cards revealed are ones dealt.
     */
    setDealReveal() {
      const cardIdsInPlay = [
        ...Object.values(this.tableau).map(getLineage),
        ...Object.values(this.foundations).map(getLineage)
      ].flat().map(card => card.id)

      this.waste = this.waste.filter(card => !cardIdsInPlay.includes(card.id))
      this.stock = this.stock.filter(card => !cardIdsInPlay.includes(card.id))
      this.waste.forEach(card => card.revealed = false)
      this.stock.forEach(card => card.revealed = false)
      getLineage(this.dealSpace).forEach(card => card.revealed = true)
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

      this.cards[cardId].parent = this.cards[nextParentId]
      this.cards[cardId].promoted = this.cards[nextParentId].promoted
      this.cards[nextParentId].child = this.cards[cardId]
      this.isUndoing = false

      if (this.isAutoplaying) {
        this.autoplayGame()
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

      this.moveCard(sourceId, targetId)
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
      } catch (error) {
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
    },

    /**
     * Deducts points according to the number of given epochs.
     *
     * @see {@link Scoring.TIME_PENALTY_POINTS | `TIME_PENALTY_POINTS`} for the number of seconds in one epoch.
     */
    deductByEpoch (epochs: number): void {
      this.points = Math.max(this.points + epochs * Scoring.TIME_PENALTY_POINTS, 0)
    },

    /**
     * Computes the bonus awarded to the player based on seconds elapsed.
     */
    computeBonus (secondsElapsed: number): void {
      this.points = Math.max(this.points + bonus(secondsElapsed), 0)
    }
  }
})
