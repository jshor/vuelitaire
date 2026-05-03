import { setActivePinia, createPinia } from 'pinia'
import { useStore } from '../main'
import { MoveType } from '@/types/enums/MoveType'
import { Suits, Scoring } from '@/constants'
import { createCard } from '@/models/Card'
import { createLaneSpace } from '@/models/LaneSpace'
import * as hintsModule from '@/gameplay/hints'

describe('store/main', () => {
  let store: ReturnType<typeof useStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useStore()
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // ── state.ts ──────────────────────────────────────────────────────────────

  describe('initial state', () => {
    it('initializes with empty arrays and zeroed counters', () => {
      expect(store.stock).toEqual([])
      expect(store.cards).toEqual({})
      expect(store.tableau).toEqual({})
      expect(store.foundations).toEqual({})
      expect(store.hotspots).toEqual([])
      expect(store.points).toBe(0)
      expect(store.isAutoplaying).toBe(false)
      expect(store.isUndoing).toBe(false)
      expect(store.undoStack).toEqual([])
      expect(store.hints).toEqual([])
      expect(store.currentHintIndex).toBe(-1)
    })

    it('initializes a DealSpace', () => {
      expect(store.dealSpace.type).toBe('DealSpace')
    })

    it('initializes settings with dealCount of 1', () => {
      expect(store.settings.dealCount).toBe(1)
    })
  })

  describe('canUndo', () => {
    it('returns false when undoStack is empty', () => {
      expect(store.canUndo).toBe(false)
    })

    it('returns true when undoStack has items', () => {
      store.undoStack.push({ type: MoveType.DEAL, index: 0 })
      expect(store.canUndo).toBe(true)
    })
  })

  describe('canAutocomplete', () => {
    it('returns false when stock has cards', () => {
      store.stock.push(createCard())
      expect(store.canAutocomplete).toBe(false)
    })

    it('returns false when cards have been dealt (dealIndex >= 0)', () => {
      store.newGame()
      store.deal() // advances dealIndex to >= 0
      expect(store.canAutocomplete).toBe(false)
    })

    it('returns false when some cards are not revealed', () => {
      const card = createCard()
      card.revealed = false
      store.cards[card.id] = card
      expect(store.canAutocomplete).toBe(false)
    })

    it('returns true when stock/waste are empty, dealSpace has no child, and all cards are revealed', () => {
      const card = createCard({ revealed: true })
      store.cards[card.id] = card
      expect(store.canAutocomplete).toBe(true)
    })
  })

  describe('isComplete', () => {
    it('returns false when dealSpace has a child', () => {
      store.dealSpace.child = createCard()
      expect(store.isComplete).toBe(false)
    })

    it('returns false when a tableau entry has a child', () => {
      const space = createLaneSpace()
      space.child = createCard()
      store.tableau[space.id] = space
      expect(store.isComplete).toBe(false)
    })

    it('returns true when all tableau entries have no children and dealSpace is empty', () => {
      const space = createLaneSpace()
      store.tableau[space.id] = space
      expect(store.isComplete).toBe(true)
    })
  })

  describe('currentHint', () => {
    it('returns an empty array when there are no hints', () => {
      expect(store.currentHint).toEqual([])
    })

    it('returns the hint at currentHintIndex', () => {
      store.hints = [['a', 'b'], ['c', 'd']]
      store.currentHintIndex = 1
      expect(store.currentHint).toEqual(['c', 'd'])
    })
  })

  describe('hasStockCards', () => {
    it('returns false when stock is empty', () => {
      expect(store.hasStockCards).toBe(false)
    })

    it('returns true when stock has at least one card', () => {
      store.stock.push(createCard())
      expect(store.hasStockCards).toBe(true)
    })
  })

  describe('clearSelections()', () => {
    it('resets all selection-related state fields', () => {
      const card = createCard()
      const box = { left: 0, top: 0, bottom: 0, right: 0 }
      store.hotspots = [{ card, highlightSpot: box, dropSpot: box }]
      store.hints = [['a', 'b']]
      store.currentHintIndex = 1
      store.draggedCardId = 'drag'
      store.hoveredCardId = 'hover'
      store.selectedCardId = 'sel'
      store.errorCardId = 'err'
      store.teleportation = { fromId: 'a', toId: 'b' }

      store.clearSelections()

      expect(store.hotspots).toEqual([])
      expect(store.hints).toEqual([])
      expect(store.currentHintIndex).toBe(-1)
      expect(store.draggedCardId).toBeUndefined()
      expect(store.hoveredCardId).toBeUndefined()
      expect(store.selectedCardId).toBeUndefined()
      expect(store.errorCardId).toBeUndefined()
      expect(store.teleportation).toBeUndefined()
    })
  })

  describe('newGame()', () => {
    it('resets points and undoStack', () => {
      store.points = 500
      store.undoStack.push({ type: MoveType.DEAL, index: 0 })
      store.newGame()
      expect(store.points).toBe(0)
      expect(store.undoStack).toHaveLength(0)
    })

    it('clears existing tableau, foundations, and cards before rebuilding', () => {
      store.newGame()
      const firstCount = Object.keys(store.cards).length
      store.newGame()
      expect(Object.keys(store.cards).length).toBe(firstCount)
    })

    it('registers 64 entries in cards map (52 regular + 7 lane spaces + 4 foundations + 1 deal space)', () => {
      store.newGame()
      expect(Object.keys(store.cards)).toHaveLength(64)
    })

    it('creates 7 tableau lane spaces', () => {
      store.newGame()
      expect(Object.keys(store.tableau)).toHaveLength(7)
    })

    it('creates 4 foundation spaces', () => {
      store.newGame()
      expect(Object.keys(store.foundations)).toHaveLength(4)
    })

    it('leaves 24 cards in the stock (52 - 28 distributed to tableau)', () => {
      store.newGame()
      expect(store.stock).toHaveLength(24)
    })

    it('reveals the tip card of each tableau lane', () => {
      store.newGame()
      Object.values(store.tableau).forEach(space => {
        let tip = space
        while (tip.child) tip = tip.child
        if (tip.type === 'Card') {
          expect(tip.revealed).toBe(true)
        }
      })
    })
  })

  describe('createStock()', () => {
    it('adds exactly 52 cards to the stock', () => {
      store.createStock()
      expect(store.stock).toHaveLength(52)
    })

    it('creates cards for all four suits', () => {
      store.createStock()
      const suits = new Set(store.stock.map(c => c.suit))
      expect(suits.size).toBe(4)
      ;[Suits.SPADES, Suits.HEARTS, Suits.DIAMONDS, Suits.CLUBS].forEach(s =>
        expect(suits).toContain(s)
      )
    })

    it('creates 13 cards per suit (ranks 0–12)', () => {
      store.createStock()
      const spadesRanks = store.stock.filter(c => c.suit === Suits.SPADES).map(c => c.rank)
      expect(spadesRanks.sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
    })

    it('registers all stock cards and the deal space in the cards map', () => {
      store.createStock()
      expect(store.cards[store.dealSpace.id]).toBe(store.dealSpace)
      store.stock.forEach(card => expect(store.cards[card.id]).toBe(card))
    })
  })

  describe('initFoundations()', () => {
    it('creates one foundation space per suit (4 total)', () => {
      store.initFoundations()
      expect(Object.keys(store.foundations)).toHaveLength(4)
    })

    it('registers each foundation in the cards map', () => {
      store.initFoundations()
      Object.keys(store.foundations).forEach(id => {
        expect(store.cards[id]).toBeDefined()
      })
    })

    it('creates foundations with the promoted flag set', () => {
      store.initFoundations()
      Object.values(store.foundations).forEach(f => {
        expect(f.promoted).toBe(true)
      })
    })
  })

  describe('initTableau()', () => {
    beforeEach(() => store.createStock())

    it('creates 7 lane spaces', () => {
      store.initTableau()
      expect(Object.keys(store.tableau)).toHaveLength(7)
    })

    it('distributes 28 cards total from the stock (1+2+...+7)', () => {
      const stockBefore = store.stock.length
      store.initTableau()
      expect(store.stock).toHaveLength(stockBefore - 28)
    })

    it('links cards into parent-child chains within each lane', () => {
      store.initTableau()
      Object.values(store.tableau).forEach(space => {
        let node = space
        while (node.child) {
          expect(node.child.parent).toBe(node)
          node = node.child
        }
      })
    })
  })

  describe('deal()', () => {
    beforeEach(() => store.newGame())

    it('advances dealIndex by 1 and sets dealSpace.child', () => {
      const indexBefore = store.dealIndex
      store.deal()
      expect(store.dealIndex).toBe(indexBefore + 1)
      expect(store.dealSpace.child).toBeDefined()
    })

    it('advances dealIndex by dealCount=3', () => {
      store.settings.dealCount = 3
      const indexBefore = store.dealIndex
      store.deal()
      expect(store.dealIndex).toBe(indexBefore + 3)
    })

    it('keeps the previously dealt card accessible in stock while dealing the next', () => {
      store.deal()
      const firstDealtId = store.dealSpace.child?.id
      store.deal()
      expect(store.stock.map(c => c.id)).toContain(firstDealtId)
    })

    it('resets dealIndex when exhausted, then deals from start', () => {
      // exhaust the stock by setting dealIndex past its length
      store.dealIndex = store.stock.length
      store.deal()
      // dealIndex was >= stock.length so it reset to -1, then incremented by dealCount
      expect(store.dealIndex).toBe(store.settings.dealCount - 1)
      expect(store.dealSpace.child).toBeDefined()
    })

    it('pushes a DEAL move onto undoStack', () => {
      store.deal()
      expect(store.undoStack.at(-1)?.type).toBe(MoveType.DEAL)
    })

    it('sets the dealt card parent to the deal space', () => {
      store.deal()
      expect(store.dealSpace.child?.parent).toBe(store.dealSpace)
    })
  })

  describe('undeal()', () => {
    beforeEach(() => store.newGame())

    it('moves the dealt card back to the stock', () => {
      store.deal()
      const dealtId = store.dealSpace.child?.id
      store.undo()
      expect(store.dealSpace.child).toBeUndefined()
      expect(store.stock.map(c => c.id)).toContain(dealtId)
    })

    it('re-establishes previously wasted cards on the deal pile when undoing a second deal', () => {
      store.deal()
      const cardA = store.dealSpace.child

      store.deal()
      const cardB = store.dealSpace.child

      store.undo() // undoes second deal

      // cardA should be back at dealSpace, cardB back in stock
      expect(store.dealSpace.child?.id).toBe(cardA?.id)
      expect(store.stock.map(c => c.id)).toContain(cardB?.id)
    })
  })

  describe('undo()', () => {
    beforeEach(() => store.newGame())

    it('does nothing when the undoStack is empty', () => {
      expect(() => store.undo()).not.toThrow()
    })

    it('calls undeal for a DEAL move', () => {
      store.deal()
      const dealtId = store.dealSpace.child?.id
      const stackBefore = store.undoStack.length
      store.undo()
      expect(store.undoStack.length).toBe(stackBefore - 1)
      expect(store.stock.map(c => c.id)).toContain(dealtId)
    })

    it('calls unmoveCard for a MOVE move', () => {
      const card = createCard({ revealed: true })
      const fromParent = createLaneSpace()
      const toParent = createLaneSpace()

      store.cards[card.id] = card
      store.cards[fromParent.id] = fromParent
      store.cards[toParent.id] = toParent

      card.parent = fromParent
      fromParent.child = card

      store.undoStack.push({
        type: MoveType.MOVE,
        cardId: card.id,
        fromId: fromParent.id,
        toId: toParent.id,
        revealed: false
      })

      store.undo()

      expect(store.teleportation).toEqual({ fromId: card.id, toId: fromParent.id })
    })
  })

  describe('moveCard()', () => {
    it('sets teleportation with the provided from/to IDs', () => {
      store.moveCard('from-id', 'to-id')
      expect(store.teleportation).toEqual({ fromId: 'from-id', toId: 'to-id' })
    })

    it('clears previous selections when called', () => {
      store.selectedCardId = 'some-card'
      store.moveCard('from-id', 'to-id')
      expect(store.selectedCardId).toBeUndefined()
    })
  })

  describe('unmoveCard()', () => {
    it('sets isUndoing, triggers moveCard with reversed IDs, and restores revealed state', () => {
      store.newGame()
      const parent = createLaneSpace()
      const card = createCard()

      store.cards[parent.id] = parent
      store.cards[card.id] = card

      store.unmoveCard({
        type: MoveType.MOVE,
        cardId: card.id,
        fromId: parent.id,
        toId: 'somewhere',
        revealed: false
      })

      expect(store.teleportation).toEqual({ fromId: card.id, toId: parent.id })
      // !move.revealed = !false = true
      expect(store.cards[parent.id].revealed).toBe(true)
    })

    it('hides the from-parent when move.revealed was true', () => {
      store.newGame()
      const parent = createLaneSpace()
      const card = createCard({ revealed: true })

      store.cards[parent.id] = parent
      store.cards[card.id] = card

      store.unmoveCard({
        type: MoveType.MOVE,
        cardId: card.id,
        fromId: parent.id,
        toId: 'somewhere',
        revealed: true
      })

      expect(store.cards[parent.id].revealed).toBe(false)
    })
  })

  describe('setDeal()', () => {
    beforeEach(() => store.newGame())

    it('sets dealSpace.child to stock[dealIndex] after a deal', () => {
      store.deal()
      expect(store.dealSpace.child?.id).toBe(store.stock[store.dealIndex]?.id)
    })

    it('clears dealSpace.child when dealIndex is -1', () => {
      store.deal()
      store.dealIndex = -1
      store.setDeal()
      expect(store.dealSpace.child).toBeUndefined()
    })

    it('sets the parent of the dealt card to the dealSpace', () => {
      store.deal()
      expect(store.dealSpace.child?.parent).toBe(store.dealSpace)
    })
  })

  describe('adoptNewCard()', () => {
    let card: ReturnType<typeof createCard>
    let fromParent: ReturnType<typeof createLaneSpace>
    let toParent: ReturnType<typeof createLaneSpace>

    beforeEach(() => {
      store.newGame()
      card = createCard({ revealed: true })
      fromParent = createLaneSpace()
      toParent = createLaneSpace()
      store.cards[card.id] = card
      store.cards[fromParent.id] = fromParent
      store.cards[toParent.id] = toParent
      card.parent = fromParent
      fromParent.child = card
    })

    it('does nothing when the next parent is the same as the current parent', () => {
      const undoBefore = store.undoStack.length
      store.adoptNewCard(card.id, fromParent.id)
      expect(store.undoStack.length).toBe(undoBefore)
    })

    it('links the card to a new parent without a prior parent (no undo push)', () => {
      card.parent = undefined
      fromParent.child = undefined
      const undoBefore = store.undoStack.length
      store.adoptNewCard(card.id, toParent.id)
      expect(store.cards[card.id].parent?.id).toBe(toParent.id)
      expect(store.undoStack.length).toBe(undoBefore)
    })

    it('pushes a MOVE to undoStack when not undoing', () => {
      store.isUndoing = false
      store.adoptNewCard(card.id, toParent.id)
      expect(store.undoStack.at(-1)?.type).toBe(MoveType.MOVE)
    })

    it('does not push to undoStack when isUndoing is true', () => {
      store.isUndoing = true
      const undoBefore = store.undoStack.length
      store.adoptNewCard(card.id, toParent.id)
      expect(store.undoStack.length).toBe(undoBefore)
    })

    it('links the card to the new parent', () => {
      store.adoptNewCard(card.id, toParent.id)
      expect(store.cards[toParent.id].child?.id).toBe(card.id)
      expect(store.cards[card.id].parent?.id).toBe(toParent.id)
    })

    it('unlinks the card from the old parent', () => {
      store.adoptNewCard(card.id, toParent.id)
      expect(fromParent.child).toBeUndefined()
    })

    it('reveals the old parent after the move', () => {
      fromParent.revealed = false
      store.adoptNewCard(card.id, toParent.id)
      expect(fromParent.revealed).toBe(true)
    })

    it('inherits the promoted flag from the new parent', () => {
      store.cards[toParent.id].promoted = true
      store.adoptNewCard(card.id, toParent.id)
      expect(store.cards[card.id].promoted).toBe(true)
    })

    it('resets isUndoing to false after the move', () => {
      store.isUndoing = true
      store.adoptNewCard(card.id, toParent.id)
      expect(store.isUndoing).toBe(false)
    })

    it('triggers autoplayGame when isAutoplaying is set', () => {
      store.isAutoplaying = true
      const spy = vi.spyOn(store, 'autoplayGame')
      store.adoptNewCard(card.id, toParent.id)
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('revealHint()', () => {
    beforeEach(() => store.newGame())

    it('does nothing when generateHints returns an empty array', () => {
      vi.spyOn(hintsModule, 'generateHints').mockReturnValueOnce([])
      store.revealHint()
      expect(store.currentHintIndex).toBe(-1)
    })

    it('sets hints on state and increments currentHintIndex from -1 to 0', () => {
      vi.spyOn(hintsModule, 'generateHints').mockReturnValue([['a', 'b'], ['c', 'd']])
      store.revealHint()
      expect(store.hints).toEqual([['a', 'b'], ['c', 'd']])
      expect(store.currentHintIndex).toBe(0)
    })

    it('advances currentHintIndex on subsequent calls', () => {
      vi.spyOn(hintsModule, 'generateHints').mockReturnValue([['a', 'b'], ['c', 'd']])
      store.revealHint()
      store.revealHint()
      expect(store.currentHintIndex).toBe(1)
    })

    it('wraps currentHintIndex back to 0 when it reaches the end', () => {
      vi.spyOn(hintsModule, 'generateHints').mockReturnValue([['a', 'b']])
      store.currentHintIndex = 0
      store.revealHint()
      expect(store.currentHintIndex).toBe(0)
    })
  })

  describe('autoplayCard()', () => {
    beforeEach(() => store.newGame())

    it('calls moveCard when a hint is found for the card', () => {
      const cardId = 'my-card'
      vi.spyOn(hintsModule, 'generateHints').mockReturnValueOnce([[cardId, 'target']])
      const moveCardSpy = vi.spyOn(store, 'moveCard')
      store.autoplayCard(cardId)
      expect(moveCardSpy).toHaveBeenCalledWith(cardId, 'target')
    })

    it('sets errorCardId when no hint is found for the card', () => {
      vi.spyOn(hintsModule, 'generateHints').mockReturnValueOnce([])
      store.autoplayCard('orphan-card')
      expect(store.errorCardId).toBe('orphan-card')
    })
  })

  describe('autoplayGame()', () => {
    beforeEach(() => store.newGame())

    it('returns early when isComplete is true', async () => {
      Object.values(store.tableau).forEach(s => { (s).child = undefined })
      store.dealSpace.child = undefined
      const spy = vi.spyOn(store, 'moveCard')
      await store.autoplayGame()
      expect(spy).not.toHaveBeenCalled()
    })

    it('returns early when canAutocomplete is false (stock not empty)', async () => {
      const spy = vi.spyOn(store, 'moveCard')
      await store.autoplayGame()
      expect(spy).not.toHaveBeenCalled()
    })

    it('calls moveCard with the last 2-card hint when autocomplete is possible', async () => {
      vi.useFakeTimers()
      store.stock = []
      store.dealIndex = -1
      Object.values(store.cards).forEach(c => { c.revealed = true })
      vi.spyOn(hintsModule, 'generateHints').mockReturnValue([
        ['src1', 'dst1'],
        ['src2', 'dst2']
      ])
      const spy = vi.spyOn(store, 'moveCard')
      await store.autoplayGame()
      vi.runAllTimers()
      vi.useRealTimers()
      expect(spy).toHaveBeenCalledWith('src2', 'dst2')
    })

    it('does not call moveCard when no 2-item hints are available', async () => {
      store.stock = []
      store.dealIndex = -1
      Object.values(store.cards).forEach(c => { c.revealed = true })
      vi.spyOn(hintsModule, 'generateHints').mockReturnValue([])
      const spy = vi.spyOn(store, 'moveCard')
      await store.autoplayGame()
      expect(spy).not.toHaveBeenCalled()
    })
  })

  describe('loadLocalStorageSettings()', () => {
    it('applies valid settings from localStorage', () => {
      localStorage.setItem('settings', JSON.stringify({ dealCount: 3 }))
      store.loadLocalStorageSettings()
      expect(store.settings.dealCount).toBe(3)
    })

    it('keeps default settings when localStorage has no settings entry', () => {
      store.loadLocalStorageSettings()
      expect(store.settings.dealCount).toBe(1)
    })

    it('keeps default settings when localStorage contains invalid JSON', () => {
      localStorage.setItem('settings', '{{not-valid}}')
      store.loadLocalStorageSettings()
      expect(store.settings.dealCount).toBe(1)
    })
  })

  describe('updateSettings()', () => {
    it('merges partial settings into state', () => {
      store.updateSettings({ dealCount: 3 })
      expect(store.settings.dealCount).toBe(3)
    })

    it('persists full settings to localStorage', () => {
      store.updateSettings({ showScore: false })
      const saved = JSON.parse(localStorage.getItem('settings') || '')
      expect(saved.showScore).toBe(false)
    })
  })

  describe('start()', () => {
    beforeEach(() => {
      vi.stubGlobal('requestAnimationFrame', vi.fn())
    })

    afterEach(() => {
      vi.unstubAllGlobals()
    })

    it('does nothing when isStopped is already false', () => {
      store.isStopped = false
      const tickSpy = vi.spyOn(store, 'tick')
      store.start()
      expect(tickSpy).not.toHaveBeenCalled()
    })

    it('sets isStopped to false and calls tick() when stopped', () => {
      store.isStopped = true
      const tickSpy = vi.spyOn(store, 'tick').mockImplementation(() => {})
      store.start()
      expect(store.isStopped).toBe(false)
      expect(tickSpy).toHaveBeenCalled()
    })
  })

  describe('stop()', () => {
    it('sets isStopped to true', () => {
      store.isStopped = false
      store.stop()
      expect(store.isStopped).toBe(true)
    })

    it('saves the current seconds value to offset', () => {
      store.seconds = 42
      store.stop()
      expect(store.offset).toBe(42)
    })
  })

  describe('tick()', () => {
    let rafSpy: ReturnType<typeof vi.fn>

    beforeEach(() => {
      rafSpy = vi.fn()
      vi.stubGlobal('requestAnimationFrame', rafSpy)
      store.isStopped = false
      store.seconds = 0
      store.offset = 0
      store.lastDeductionTime = 0
      store.points = 100
    })

    afterEach(() => {
      vi.unstubAllGlobals()
    })

    it('returns early and skips requestAnimationFrame when isStopped is true', () => {
      store.isStopped = true
      store.tick(Date.now() - 1000)
      expect(rafSpy).not.toHaveBeenCalled()
    })

    it('updates seconds based on elapsed time', () => {
      const now = Date.now()
      vi.spyOn(Date, 'now').mockReturnValue(now)
      store.offset = 0
      store.tick(now - 5000)
      expect(store.seconds).toBe(5)
    })

    it('accounts for offset when updating seconds', () => {
      const now = Date.now()
      vi.spyOn(Date, 'now').mockReturnValue(now)
      store.offset = 10
      store.tick(now - 3000)
      expect(store.seconds).toBe(13)
    })

    it('does not update seconds when lastTickTime equals now', () => {
      const now = Date.now()
      vi.spyOn(Date, 'now').mockReturnValue(now)
      store.seconds = 7
      store.tick(now)
      expect(store.seconds).toBe(7)
    })

    it('calls deductByEpoch(1) when an epoch has elapsed', () => {
      const now = Date.now()
      vi.spyOn(Date, 'now').mockReturnValue(now)
      const deductSpy = vi.spyOn(store, 'deductByEpoch')
      store.seconds = Scoring.TIME_PENALTY_MS
      store.lastDeductionTime = 0
      store.tick(now) // no time update; 0 + TIME_PENALTY_MS <= TIME_PENALTY_MS → true
      expect(deductSpy).toHaveBeenCalledWith(1)
    })

    it('updates lastDeductionTime to current seconds after deducting', () => {
      const now = Date.now()
      vi.spyOn(Date, 'now').mockReturnValue(now)
      store.seconds = Scoring.TIME_PENALTY_MS
      store.lastDeductionTime = 0
      store.tick(now)
      expect(store.lastDeductionTime).toBe(Scoring.TIME_PENALTY_MS)
    })

    it('does not call deductByEpoch before the epoch threshold', () => {
      const now = Date.now()
      vi.spyOn(Date, 'now').mockReturnValue(now)
      const deductSpy = vi.spyOn(store, 'deductByEpoch')
      store.seconds = Scoring.TIME_PENALTY_MS - 1
      store.lastDeductionTime = 0
      store.tick(now)
      expect(deductSpy).not.toHaveBeenCalled()
    })

    it('calls stop() and computeBonus() when isComplete', () => {
      const now = Date.now()
      vi.spyOn(Date, 'now').mockReturnValue(now)
      store.dealSpace.child = undefined
      store.tableau = {}
      store.seconds = 60
      const stopSpy = vi.spyOn(store, 'stop')
      const bonusSpy = vi.spyOn(store, 'computeBonus')
      store.tick(now)
      expect(stopSpy).toHaveBeenCalled()
      expect(bonusSpy).toHaveBeenCalledWith(60)
    })

    it('schedules the next frame via requestAnimationFrame', () => {
      const now = Date.now()
      vi.spyOn(Date, 'now').mockReturnValue(now)
      store.tick(now)
      expect(rafSpy).toHaveBeenCalled()
    })
  })

  describe('toggleDialog()', () => {
    it('opens the dialog by setting showDialog to true', () => {
      store.toggleDialog(true)
      expect(store.settings.showDialog).toBe(true)
    })

    it('closes the dialog by setting showDialog to false', () => {
      store.settings.showDialog = true
      store.toggleDialog(false)
      expect(store.settings.showDialog).toBe(false)
    })
  })

  describe('deductByEpoch()', () => {
    it('deducts TIME_PENALTY_POINTS per epoch', () => {
      store.points = 100
      store.deductByEpoch(1)
      expect(store.points).toBe(100 + Scoring.TIME_PENALTY_POINTS)
    })

    it('deducts for multiple epochs', () => {
      store.points = 100
      store.deductByEpoch(3)
      expect(store.points).toBe(100 + 3 * Scoring.TIME_PENALTY_POINTS)
    })

    it('clamps to 0 when the deduction would go below zero', () => {
      store.points = 0
      store.deductByEpoch(10)
      expect(store.points).toBe(0)
    })
  })

  describe('computeBonus()', () => {
    it('adds bonus points when elapsed time is >= 30 seconds', () => {
      store.points = 100
      store.computeBonus(60)
      expect(store.points).toBeGreaterThan(100)
    })

    it('adds 0 bonus when elapsed time is < 30 seconds', () => {
      store.points = 100
      store.computeBonus(29)
      expect(store.points).toBe(100)
    })

    it('clamps to 0 when points would go negative after bonus', () => {
      store.points = 0
      store.computeBonus(29) // bonus = 0; max(0, 0) = 0
      expect(store.points).toBe(0)
    })
  })
})
