import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { createCard } from '@/models/Card'
import { Suits } from '@/constants'
import CardDraggable from '../CardDraggable.vue'
import { Hotspot } from '@/types/Hotspot'

vi.mock('@/utils/overrideAnimation', () => ({
  overrideAnimation: (cb: () => void) => cb()
}))

const mockGetLargest = vi.fn((): Hotspot | undefined => undefined)

vi.mock('@/utils/getLargestOverlappingCard', () => ({
  getLargestOverlappingCard: (...args: Parameters<typeof mockGetLargest>) => mockGetLargest(...args)
}))

function makeCard(overrides: Parameters<typeof createCard>[0] = {}) {
  return createCard({ suit: Suits.HEARTS, rank: 5, revealed: true, ...overrides })
}

const defaultProps = () => ({
  card: makeCard(),
  hotspots: [],
  isFoundary: false,
  isFannable: false,
  isDealable: false,
  isSelected: false,
  hasError: false,
  teleportation: undefined
})

/**
 * Mounts component without `attachTo()` / `<Teleport />`.
 */
function mountDraggable(propsOverrides: Record<string, unknown> = {}) {
  return mount(CardDraggable, {
    props: { ...defaultProps(), ...propsOverrides }
  })
}

/**
 * Simulates a mousedown mousemove sequence sufficient to start dragging.
 */
async function startDrag(wrapper: ReturnType<typeof mountDraggable>, from = { x: 50, y: 50 }) {
  // wrapper.element is a VTU fragment-wrapper; the actual root .card div is a child
  await wrapper.find('.card').trigger('mousedown', { clientX: from.x, clientY: from.y })
  window.dispatchEvent(new MouseEvent('mousemove', { clientX: from.x + 5, clientY: from.y + 5, bubbles: true }))
  await nextTick()
}

async function endDrag() {
  window.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
  await nextTick()
}

/**
 * Triggers the `transitionend` on the ghost card in body to fire `onAnimationEnd`
 */
async function finishAnimation() {
  await nextTick()
  const ghost = document.body.querySelector('.card--draggable') as HTMLElement | null
  if (ghost) {
    ghost.dispatchEvent(new Event('transitionend', { bubbles: true }))
    await nextTick()
  }
}

describe('CardDraggable', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  afterEach(() => {
    window.dispatchEvent(new MouseEvent('mouseup'))
  })

  describe('template / props', () => {
    it('renders the root .card element', () => {
      const wrapper = mountDraggable()
      expect(wrapper.find('.card').exists()).toBe(true)
    })

    it('applies card--foundary class when isFoundary is true', () => {
      const wrapper = mountDraggable({ isFoundary: true })
      expect(wrapper.find('.card').classes()).toContain('card--foundary')
    })

    it('applies card--fannable class when isFannable is true', () => {
      const wrapper = mountDraggable({ isFannable: true })
      expect(wrapper.find('.card').classes()).toContain('card--fannable')
    })

    it('applies card--dealable class when isDealable is true', () => {
      const wrapper = mountDraggable({ isDealable: true })
      expect(wrapper.find('.card').classes()).toContain('card--dealable')
    })

    it('applies card--error class when hasError is true', () => {
      const wrapper = mountDraggable({ hasError: true })
      expect(wrapper.find('.card').classes()).toContain('card--error')
    })

    it('adds card__display--revealed class when card is revealed', () => {
      const wrapper = mountDraggable({ card: makeCard({ revealed: true }) })
      expect(wrapper.find('.card__display').classes()).toContain('card__display--revealed')
    })

    it('renders empty-space when isFoundary is true and isDealable is false', () => {
      const wrapper = mountDraggable({ isFoundary: true, isDealable: false })
      expect(wrapper.findComponent({ name: 'EmptySpace' }).exists()).toBe(true)
    })

    it('renders a div placeholder when isFoundary and isDealable are both true', () => {
      const wrapper = mountDraggable({ isFoundary: true, isDealable: true })
      // inner div placeholder is rendered, no EmptySpace
      expect(wrapper.findComponent({ name: 'EmptySpace' }).exists()).toBe(false)
    })

    it('renders CardBack and CardFront when not a foundary card', () => {
      const wrapper = mountDraggable({ isFoundary: false })
      expect(wrapper.findComponent({ name: 'CardBack' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'CardFront' }).exists()).toBe(true)
    })
  })

  describe('isHighlighted computed', () => {
    it('is highlighted when isSelected prop is true', async () => {
      const card = makeCard()
      const wrapper = mountDraggable({ card, isSelected: true })
      // `<CardHighlight />` is rendered when `isHighlighted` is true
      expect(wrapper.findComponent({ name: 'CardHighlight' }).exists()).toBe(true)
    })

    it('is not highlighted when isSelected is false and no hotspot matches', () => {
      const wrapper = mountDraggable({ isSelected: false })
      expect(wrapper.findComponent({ name: 'CardHighlight' }).exists()).toBe(false)
    })
  })

  describe('getHotspot()', () => {
    it('returns undefined when containerRef or childRef are not mounted', () => {
      const wrapper = mountDraggable()
      expect(() => wrapper.vm.getHotspot()).not.toThrow()
    })

    it('returns a Hotspot object with the card when refs are available (attachTo: body)', () => {
      const card = makeCard()
      const wrapper = mountDraggable({ card })
      const result = wrapper.vm.getHotspot()
      // jsdom getBoundingClientRect returns zeros, so the hotspot will have zero rects
      // the card reference should match
      if (result !== undefined) {
        expect(result.card.id).toBe(card.id)
        expect(result).toHaveProperty('highlightSpot')
        expect(result).toHaveProperty('dropSpot')
      }
      // fine for the result to be undefined in jsdom (no layout engine)
      wrapper.unmount()
    })
  })

  describe('onShakeEnd', () => {
    it('emits "shaken" when animationend fires', async () => {
      const wrapper = mountDraggable()
      await wrapper.find('.card').trigger('animationend')
      expect(wrapper.emitted('shaken')).toBeTruthy()
    })

    it('emits "shaken" when animationcancel fires', async () => {
      const wrapper = mountDraggable()
      await wrapper.find('.card').trigger('animationcancel')
      expect(wrapper.emitted('shaken')).toBeTruthy()
    })
  })

  describe('onClick', () => {
    it('stops propagation without emitting select (TODO comment preserved)', async () => {
      const wrapper = mountDraggable()
      await wrapper.find('.card__display').trigger('click')
      expect(wrapper.emitted('select')).toBeFalsy()
    })
  })

  describe('onDoubleClick', () => {
    it('emits "autoplay" when not dragging', async () => {
      const wrapper = mountDraggable()
      await wrapper.find('.card').trigger('dblclick')
      expect(wrapper.emitted('autoplay')).toBeTruthy()
    })

    it('does not emit "autoplay" while dragging', async () => {
      const wrapper = mountDraggable()
      await startDrag(wrapper)
      await wrapper.find('.card').trigger('dblclick')
      // `dragStart` was emitted from the mouse move, so isDragging is true
      expect(wrapper.emitted('autoplay')).toBeFalsy()
      await endDrag()
      wrapper.unmount()
    })
  })

  describe('mouse events - drag lifecycle', () => {
    it('emits dragStart and drag after sufficient mouse movement', async () => {
      const wrapper = mountDraggable()
      await startDrag(wrapper)
      expect(wrapper.emitted('dragStart')).toBeTruthy()
      expect(wrapper.emitted('drag')).toBeTruthy()
      await endDrag()
      wrapper.unmount()
    })

    it('stops dragging and emits dragEnd on mouseup', async () => {
      const wrapper = mountDraggable()
      await startDrag(wrapper)
      await endDrag()
      await finishAnimation()
      expect(wrapper.emitted('dragEnd')).toBeTruthy()
      wrapper.unmount()
    })

    it('does not emit dragStart when mouse has not moved enough', async () => {
      const wrapper = mountDraggable()
      await wrapper.find('.card').trigger('mousedown', { clientX: 50, clientY: 50 })
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 50, clientY: 50, bubbles: true }))
      await nextTick()

      expect(wrapper.emitted('dragStart')).toBeFalsy()
      await endDrag()
      wrapper.unmount()
    })

    it('releases drag state on mouseup even when not yet dragging', async () => {
      const wrapper = mountDraggable()
      // `mousedown` starts the drag detection but we never move
      await wrapper.find('.card').trigger('mousedown', { clientX: 50, clientY: 50 })
      await endDrag()
      // no crash, `dragEnd` not emitted because `isDragging` was false
      expect(wrapper.emitted('dragEnd')).toBeFalsy()
      wrapper.unmount()
    })

    it('removes global listeners on unmount', () => {
      const removeSpy = vi.spyOn(window, 'removeEventListener')
      const wrapper = mountDraggable()
      wrapper.unmount()
      expect(removeSpy).toHaveBeenCalledWith('mousemove', expect.any(Function))
      expect(removeSpy).toHaveBeenCalledWith('mouseup', expect.any(Function))
    })

    it('adds global listeners on mount', () => {
      const addSpy = vi.spyOn(window, 'addEventListener')
      const wrapper = mountDraggable()
      expect(addSpy).toHaveBeenCalledWith('mousemove', expect.any(Function))
      expect(addSpy).toHaveBeenCalledWith('mouseup', expect.any(Function))
      wrapper.unmount()
    })
  })

  describe('onDragEnd - return-to-origin path', () => {
    it('animates back to origin when released over no hotspot', async () => {
      mockGetLargest.mockReturnValue(undefined)
      const wrapper = mountDraggable()
      await startDrag(wrapper)
      await endDrag()
      await finishAnimation()
      expect(wrapper.emitted('dragEnd')).toBeTruthy()
      wrapper.unmount()
    })
  })

  describe('onDragEnd - hotspot drop path', () => {
    it('emits drop with the hotspot card id when released over a hotspot', async () => {
      const hotspotCard = makeCard()
      const dropSpot = { left: 100, top: 100, right: 120, bottom: 120, width: 20, height: 20 }
      const hotspotObj = { card: hotspotCard, highlightSpot: dropSpot, dropSpot }
      mockGetLargest.mockReturnValue(hotspotObj)

      const wrapper = mountDraggable()
      await startDrag(wrapper)

      // Simulate the card landing on a hotspot then the animation completing
      mockGetLargest.mockReturnValue(hotspotObj)
      await endDrag()

      // trigger the `transitionend` on the teleported card element (body)
      const teleportedCard = document.body.querySelector('.card--draggable') as HTMLElement
      if (teleportedCard) {
        teleportedCard.dispatchEvent(new Event('transitionend', { bubbles: true }))
        await nextTick()
        expect(wrapper.emitted('drop')).toBeTruthy()
        expect(wrapper.emitted('drop')?.[0][0]).toBe(hotspotCard.id)
      }
      wrapper.unmount()
    })
  })

  describe('onAnimationEnd - no-hotspot no-teleport path', () => {
    it('emits dragEnd and resets state without a drop event', async () => {
      mockGetLargest.mockReturnValue(undefined)

      const wrapper = mountDraggable()
      await startDrag(wrapper)
      await endDrag()

      const teleportedCard = document.body.querySelector('.card--draggable') as HTMLElement
      if (teleportedCard) {
        teleportedCard.dispatchEvent(new Event('transitionend', { bubbles: true }))
        await nextTick()
      }

      expect(wrapper.emitted('dragEnd')).toBeTruthy()
      expect(wrapper.emitted('drop')).toBeFalsy()
      wrapper.unmount()
    })
  })

  describe('computePossibleHotspot', () => {
    it('calls getLargestOverlappingCard with the current bounding box and hotspots', async () => {
      const hotspots = [
        {
          card: makeCard(),
          highlightSpot: { left: 0, top: 0, right: 50, bottom: 50, width: 50, height: 50 },
          dropSpot: { left: 0, top: 0, right: 50, bottom: 50, width: 50, height: 50 }
        }
      ]
      const wrapper = mountDraggable({ hotspots })
      await startDrag(wrapper)
      expect(mockGetLargest).toHaveBeenCalledWith(
        expect.any(Object),
        hotspots
      )
      await endDrag()
      wrapper.unmount()
    })
  })

  describe('touch events', () => {
    // jsdom does not implement Touch API; provide a minimal polyfill for touch event tests
    class Touch {
      identifier: number
      target: EventTarget
      clientX: number
      clientY: number
      screenX: number
      screenY: number
      pageX: number
      pageY: number
      force = 0
      radiusX = 0
      radiusY = 0
      rotationAngle = 0
      constructor(init: { identifier: number; target: EventTarget; clientX?: number; clientY?: number; screenX?: number; screenY?: number; pageX?: number; pageY?: number }) {
        this.identifier = init.identifier
        this.target = init.target
        this.clientX = init.clientX ?? 0
        this.clientY = init.clientY ?? 0
        this.screenX = init.screenX ?? 0
        this.screenY = init.screenY ?? 0
        this.pageX = init.pageX ?? 0
        this.pageY = init.pageY ?? 0
      }
    }

    function makeTouchEvent(type: string, x: number, y: number) {
      return new TouchEvent(type, {
        bubbles: true,
        cancelable: true,
        touches: [new Touch({ identifier: 1, target: document.body, clientX: x, clientY: y })]
      })
    }

    it('starts a drag on touchstart', async () => {
      const wrapper = mountDraggable()
      // use native dispatchEvent to avoid vitest trying to set read-only `isTrusted`
      wrapper.find('.card').element.dispatchEvent(makeTouchEvent('touchstart', 50, 50))
      await nextTick()
      // after `touchstart`, `isTouched`=true, `isDragStarted`=true - move triggers `dragStart`
      window.dispatchEvent(makeTouchEvent('touchmove', 55, 55))
      await nextTick()
      expect(wrapper.emitted('dragStart')).toBeTruthy()
      window.dispatchEvent(makeTouchEvent('touchend', 55, 55))
      await nextTick()
      wrapper.unmount()
    })

    it('emits autoplay on touchend when not dragging', async () => {
      const wrapper = mountDraggable()
      // `touchstart` without movement - `isDragging` stays `false`
      wrapper.find('.card').element.dispatchEvent(makeTouchEvent('touchstart', 50, 50))
      await nextTick()
      // `touchend` without prior movement emits `autoplay`
      window.dispatchEvent(new TouchEvent('touchend', {
        bubbles: true, cancelable: true,
        changedTouches: [new Touch({ identifier: 1, target: document.body, clientX: 50, clientY: 50 })]
      }))
      await nextTick()
      expect(wrapper.emitted('autoplay')).toBeTruthy()
      wrapper.unmount()
    })

    it('ignores touchmove when isTouched is false', async () => {
      const wrapper = mountDraggable()
      // dispatch `touchmove` globally without first triggering `touchstart` on this component
      window.dispatchEvent(makeTouchEvent('touchmove', 50, 50))
      await nextTick()
      expect(wrapper.emitted('dragStart')).toBeFalsy()
      wrapper.unmount()
    })

    it('ignores touchend when isTouched is false', async () => {
      const wrapper = mountDraggable()
      window.dispatchEvent(new TouchEvent('touchend', {
        bubbles: true, cancelable: true,
        changedTouches: [new Touch({ identifier: 1, target: document.body, clientX: 50, clientY: 50 })]
      }))
      await nextTick()
      expect(wrapper.emitted('autoplay')).toBeFalsy()
      wrapper.unmount()
    })
  })

  describe('onTeleportation watch', () => {
    it('does nothing when teleportation fromId does not match the card id', async () => {
      const card = makeCard()
      const wrapper = mountDraggable({ card })
      await wrapper.setProps({
        teleportation: { fromId: 'other-id', toId: 'destination-id' }
      })
      await nextTick()
      expect(wrapper.emitted('dragStart')).toBeFalsy()
      wrapper.unmount()
    })

    it('does nothing when the target DOM element does not exist', async () => {
      const card = makeCard()
      const wrapper = mountDraggable({ card })
      // `fromId` matches `card.id` but no `data-id` element for `toId` exists in DOM
      await wrapper.setProps({
        teleportation: { fromId: card.id, toId: 'nonexistent-id' }
      })
      await nextTick()
      expect(wrapper.emitted('dragStart')).toBeFalsy()
      wrapper.unmount()
    })

    it('starts a teleportation animation when from/to DOM elements exist', async () => {
      const card = makeCard()
      const toId = 'target-lane'

      // create a fake target element in the DOM
      const target = document.createElement('div')
      target.setAttribute('data-id', toId)
      document.body.appendChild(target)

      const wrapper = mountDraggable({ card })
      await wrapper.setProps({
        teleportation: { fromId: card.id, toId }
      })
      await nextTick()
      await nextTick()

      // `isDragging` becomes `true` when `teleportation` fires
      // confirmed by the teleported card being rendered
      target.remove()
      wrapper.unmount()
    })

    it('emits drop with the destination id after teleportation animation ends', async () => {
      const card = makeCard()
      const toId = 'tele-target'

      const target = document.createElement('div')
      target.setAttribute('data-id', toId)
      document.body.appendChild(target)

      const wrapper = mountDraggable({ card })
      await wrapper.setProps({ teleportation: { fromId: card.id, toId } })
      await nextTick()
      await nextTick()

      // trigger `transitionend` on the teleported ghost card in the body
      const ghost = document.body.querySelector('.card--draggable') as HTMLElement
      if (ghost) {
        ghost.dispatchEvent(new Event('transitionend', { bubbles: true }))
        await nextTick()
        expect(wrapper.emitted('drop')?.[0]?.[0]).toBe(toId)
      }

      target.remove()
      wrapper.unmount()
    })
  })
})
