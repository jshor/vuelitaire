import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import { useStore } from '@/store/main'
import { createCard } from '@/models/Card'
import { Suits } from '@/constants'
import CardDraggable from '@/components/CardDraggable.vue'
import CardContainer from '../CardContainer.vue'
import { Hotspot } from '@/types/Hotspot'

describe('CardContainer', () => {
  let pinia: ReturnType<typeof createPinia>
  let store: ReturnType<typeof useStore>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    store = useStore()
  })

  function makeCard(overrides: Parameters<typeof createCard>[0] = {}) {
    return createCard({ suit: Suits.DIAMONDS, rank: 1, revealed: true, ...overrides })
  }

  function mountCard(card = makeCard(), props: Record<string, unknown> = {}) {
    return mount(CardContainer, {
      global: { plugins: [pinia] },
      props: { card, ...props }
    })
  }

  /**
   * Mounts a card and ensures the stubbed CardDraggable has a no-op `getHotspot`
   * so the `draggableRef.value?.getHotspot()` call in onExternalCardDrag resolves safely.
   */
  function mountCardWithHotspotStub(card = makeCard(), hotspotReturn: Hotspot | undefined = undefined, props: Record<string, unknown> = {}) {
    const wrapper = mountCard(card, props)
    vi.spyOn(wrapper.findComponent(CardDraggable).vm, 'getHotspot').mockReturnValue(hotspotReturn)
    return wrapper
  }

  /** Emits an event from the stubbed CardDraggable child and waits for the DOM to update. */
  async function emitFromDraggable(wrapper: ReturnType<typeof mountCard>, event: string, ...args: unknown[]) {
    wrapper.findComponent(CardDraggable).vm.$emit(event, ...args)
    await nextTick()
  }

  describe('isSelected', () => {
    it('is true when store.selectedCardId matches the card id', () => {
      const card = makeCard()
      store.selectedCardId = card.id
      const wrapper = mountCard(card)
      expect(wrapper.findComponent(CardDraggable).props('isSelected')).toBe(true)
    })

    it('is true when store.hoveredCardId matches the card id', () => {
      const card = makeCard()
      store.hoveredCardId = card.id
      const wrapper = mountCard(card)
      expect(wrapper.findComponent(CardDraggable).props('isSelected')).toBe(true)
    })

    it('is true when store.currentHint includes the card id', async () => {
      const card = makeCard()
      const wrapper = mountCard(card)
      store.hints = [[card.id]]
      store.currentHintIndex = 0
      await nextTick()
      expect(wrapper.findComponent(CardDraggable).props('isSelected')).toBe(true)
    })

    it('is false when the card has no active selection state', () => {
      const wrapper = mountCard()
      expect(wrapper.findComponent(CardDraggable).props('isSelected')).toBe(false)
    })
  })

  describe('hasError', () => {
    it('is true when store.errorCardId matches the card id', () => {
      const card = makeCard()
      store.errorCardId = card.id
      const wrapper = mountCard(card)
      expect(wrapper.findComponent(CardDraggable).props('hasError')).toBe(true)
    })

    it('is false when a different card has the error', () => {
      const wrapper = mountCard()
      store.errorCardId = 'some-other-id'
      expect(wrapper.findComponent(CardDraggable).props('hasError')).toBe(false)
    })
  })

  describe('dragStart event', () => {
    it('sets store.draggedCardId to the card id', async () => {
      const card = makeCard()
      const wrapper = mountCard(card)
      await emitFromDraggable(wrapper, 'dragStart')
      expect(store.draggedCardId).toBe(card.id)
    })

    it('clears any existing selections', async () => {
      const card = makeCard()
      store.selectedCardId = 'some-other-id'
      const wrapper = mountCard(card)
      await emitFromDraggable(wrapper, 'dragStart')
      expect(store.selectedCardId).toBeUndefined()
    })
  })

  describe('dragEnd event', () => {
    it('clears all selections', async () => {
      const card = makeCard()
      store.selectedCardId = 'some-other-id'
      const wrapper = mountCard(card)
      await emitFromDraggable(wrapper, 'dragEnd')
      expect(store.selectedCardId).toBeUndefined()
    })
  })

  describe('drag event (onCurrentCardDrag)', () => {
    it('sets hoveredCardId to undefined when no hotspots exist', async () => {
      const card = makeCard()
      store.hotspots = []
      const wrapper = mountCard(card)
      await emitFromDraggable(wrapper, 'drag', { top: 0, left: 0, right: 10, bottom: 10, width: 10, height: 10 })
      expect(store.hoveredCardId).toBeUndefined()
    })

    it('runs without error when hotspots are present and boundingBox is passed', async () => {
      const card = makeCard()
      const targetCard = makeCard()
      const box = { top: 0, left: 0, right: 10, bottom: 10, width: 10, height: 10 }
      store.hotspots = [{ card: targetCard, highlightSpot: { top: 200, left: 200, right: 300, bottom: 300 }, dropSpot: box }]
      const wrapper = mountCard(card)
      await emitFromDraggable(wrapper, 'drag', box)
      expect(store.hoveredCardId).toBeUndefined()
    })
  })

  describe('select event (onSelect)', () => {
    it('sets selectedCardId when no card is currently selected', async () => {
      const card = makeCard()
      const wrapper = mountCard(card)
      await emitFromDraggable(wrapper, 'select')
      expect(store.selectedCardId).toBe(card.id)
    })

    it('calls moveCard when a different card is already selected', async () => {
      const card = makeCard()
      const otherCardId = 'other-card-id'
      store.selectedCardId = otherCardId
      const moveCardSpy = vi.spyOn(store, 'moveCard')
      const wrapper = mountCard(card)
      await emitFromDraggable(wrapper, 'select')
      expect(moveCardSpy).toHaveBeenCalledWith(otherCardId, card.id)
    })

    it('does nothing when isSelectable is false', async () => {
      const card = makeCard()
      const wrapper = mountCard(card, { isSelectable: false })
      await emitFromDraggable(wrapper, 'select')
      expect(store.selectedCardId).toBeUndefined()
    })
  })

  describe('shaken event (onShaken)', () => {
    it('clears errorCardId when it matches the card', async () => {
      const card = makeCard()
      store.errorCardId = card.id
      const wrapper = mountCard(card)
      await emitFromDraggable(wrapper, 'shaken')
      expect(store.errorCardId).toBeUndefined()
    })

    it('leaves errorCardId unchanged for a different card', async () => {
      const wrapper = mountCard()
      store.errorCardId = 'other-id'
      await emitFromDraggable(wrapper, 'shaken')
      expect(store.errorCardId).toBe('other-id')
    })
  })

  describe('autoplay event (onAutoplay)', () => {
    it('calls store.autoplayCard with the card id', async () => {
      const card = makeCard()
      const autoplayCardSpy = vi.spyOn(store, 'autoplayCard')
      const wrapper = mountCard(card)
      await emitFromDraggable(wrapper, 'autoplay')
      expect(autoplayCardSpy).toHaveBeenCalledWith(card.id)
    })
  })

  describe('drop event (onDrop)', () => {
    it('calls store.adoptNewCard with the card id and the drop target id', async () => {
      const card = makeCard()
      store.cards[card.id] = card
      const targetId = 'target-card-id'
      const adoptNewCardSpy = vi.spyOn(store, 'adoptNewCard').mockImplementation(() => {})
      const wrapper = mountCard(card)
      await emitFromDraggable(wrapper, 'drop', targetId)
      expect(adoptNewCardSpy).toHaveBeenCalledWith(card.id, targetId)
    })

    it('uses hoveredCardId as the adopter when set', async () => {
      const card = makeCard()
      store.cards[card.id] = card
      const hoveredId = 'hovered-id'
      store.hoveredCardId = hoveredId
      const adoptNewCardSpy = vi.spyOn(store, 'adoptNewCard').mockImplementation(() => {})
      const wrapper = mountCard(card)
      await emitFromDraggable(wrapper, 'drop', 'next-parent-id')
      expect(adoptNewCardSpy).toHaveBeenCalled()
    })
  })

  describe('onExternalCardDrag (watch on store.draggedCardId)', () => {
    it('does nothing when draggedCardId becomes undefined', async () => {
      const card = makeCard()
      store.cards[card.id] = card
      store.draggedCardId = card.id
      mountCard(card)
      store.draggedCardId = undefined
      await nextTick()
      expect(store.hotspots).toEqual([])
    })

    it('does nothing when the card already has a child', async () => {
      const child = makeCard()
      const card = makeCard({ child })
      store.cards[card.id] = card
      const dragged = makeCard()
      store.cards[dragged.id] = dragged
      mountCard(card)
      store.draggedCardId = dragged.id
      await nextTick()
      expect(store.hotspots).toEqual([])
    })

    it('does nothing when the dragged card is an ancestor of this card', async () => {
      const parent = makeCard()
      const card = makeCard({ child: undefined })
      parent.child = card
      card.parent = parent
      store.cards[parent.id] = parent
      store.cards[card.id] = card
      mountCardWithHotspotStub(card)
      store.draggedCardId = parent.id
      await nextTick()
      expect(store.hotspots).toEqual([])
    })

    it('does not push a hotspot when canAcceptCard returns false', async () => {
      const card = makeCard({ child: undefined })
      store.cards[card.id] = card
      const dragged = makeCard()
      store.cards[dragged.id] = dragged
      vi.spyOn(card, 'canAcceptCard').mockReturnValue(false)
      const mockHotspot = { card, highlightSpot: { top: 0, left: 0, right: 10, bottom: 10, width: 10, height: 10 }, dropSpot: { top: 0, left: 0, right: 10, bottom: 10, width: 10, height: 10 } }
      mountCardWithHotspotStub(card, mockHotspot)
      store.draggedCardId = dragged.id
      await nextTick()
      expect(store.hotspots.length).toBe(0)
    })

    it('pushes a hotspot when the card can accept the dragged card', async () => {
      const card = makeCard({ child: undefined })
      store.cards[card.id] = card
      const dragged = makeCard()
      store.cards[dragged.id] = dragged
      vi.spyOn(card, 'canAcceptCard').mockReturnValue(true)
      const mockHotspot = { card, highlightSpot: { top: 0, left: 0, right: 10, bottom: 10, width: 10, height: 10 }, dropSpot: { top: 0, left: 0, right: 10, bottom: 10, width: 10, height: 10 } }
      mountCardWithHotspotStub(card, mockHotspot)
      store.draggedCardId = dragged.id
      await nextTick()
      expect(store.hotspots.length).toBe(1)
      expect(store.hotspots[0]).toMatchObject({ card })
    })
  })

  describe('card with a child (recursive rendering)', () => {
    it('renders CardDraggable when the card has a child', () => {
      const child = makeCard()
      const card = makeCard({ child })
      const wrapper = mountCard(card)
      expect(wrapper.findComponent(CardDraggable).exists()).toBe(true)
    })
  })
})
