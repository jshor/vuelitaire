import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import { useStore } from '@/store/main'
import ActionButton from '@/components/ActionButton.vue'
import Stats from '@/components/Stats.vue'
import Game from '@/components/Game.vue'
import GameContainer from '../GameContainer.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

vi.mock('@/utils/overrideAnimation', () => ({
  overrideAnimation: (cb: () => void) => cb()
}))
vi.mock('canvas-confetti', () => ({ default: vi.fn() }))

describe('GameContainer', () => {
  let pinia: ReturnType<typeof createPinia>
  let store: ReturnType<typeof useStore>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    store = useStore()
    store.newGame()
  })

  function mountGame() {
    return mount(GameContainer, {
      global: {
        plugins: [pinia],
        components: { FontAwesomeIcon },
        stubs: {
          CardContainer: true,
          DeckContainer: true,
          CardDraggable: true,
        }
      }
    })
  }

  describe('layout', () => {
    it('renders the Game component', () => {
      const wrapper = mountGame()
      expect(wrapper.findComponent(Game).exists()).toBe(true)
    })

    it('renders Stats component with points and time', () => {
      const wrapper = mountGame()
      const stats = wrapper.findComponent(Stats)
      expect(stats.exists()).toBe(true)
    })

    it('renders ActionButton components', () => {
      const wrapper = mountGame()
      expect(wrapper.findAllComponents(ActionButton).length).toBeGreaterThan(0)
    })
  })

  describe('isPaused', () => {
    it('is false when game is running', () => {
      const wrapper = mountGame()
      expect(wrapper.findComponent(Game).props('isPaused')).toBe(false)
    })

    it('is true when game is stopped', async () => {
      store.stop()
      const wrapper = mountGame()
      expect(wrapper.findComponent(Game).props('isPaused')).toBe(true)
    })
  })

  describe('isComplete', () => {
    it('passes isComplete to Game', () => {
      const wrapper = mountGame()
      expect(wrapper.findComponent(Game).props('isComplete')).toBe(false)
    })
  })

  describe('newGame()', () => {
    it('calls store.newGame when Deal button is clicked', async () => {
      const newGameSpy = vi.spyOn(store, 'newGame')
      const wrapper = mountGame()
      // Deal button is the first ActionButton
      await wrapper.findAllComponents(ActionButton)[0].trigger('click')
      expect(newGameSpy).toHaveBeenCalled()
    })
  })

  describe('undo()', () => {
    it('calls store.undo when Undo button is clicked', async () => {
      const undoSpy = vi.spyOn(store, 'undo')
      // Make a deal to enable canUndo (undoStack must be non-empty)
      store.deal()
      const wrapper = mountGame()
      await nextTick()
      const undoBtn = wrapper.findAllComponents(ActionButton).find(b => b.text().includes('Undo'))
      await undoBtn!.trigger('click')
      expect(undoSpy).toHaveBeenCalled()
    })
  })

  describe('revealHint()', () => {
    it('calls store.revealHint when Hint button is clicked', async () => {
      const revealHintSpy = vi.spyOn(store, 'revealHint')
      const wrapper = mountGame()
      const hintBtn = wrapper.findAllComponents(ActionButton).find(b => b.text().includes('Hint'))
      await hintBtn!.trigger('click')
      expect(revealHintSpy).toHaveBeenCalled()
    })
  })

  describe('stop/start', () => {
    it('shows Pause button when game is running', () => {
      const wrapper = mountGame()
      const pauseBtn = wrapper.findAllComponents(ActionButton).find(b => b.text().includes('Pause'))
      expect(pauseBtn).toBeDefined()
    })

    it('calls store.stop when Pause button is clicked', async () => {
      const stopSpy = vi.spyOn(store, 'stop')
      const wrapper = mountGame()
      const pauseBtn = wrapper.findAllComponents(ActionButton).find(b => b.text().includes('Pause'))
      await pauseBtn!.trigger('click')
      expect(stopSpy).toHaveBeenCalled()
    })
  })
})
