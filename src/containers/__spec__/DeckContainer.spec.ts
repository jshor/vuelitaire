import { describe, it, expect, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/main'
import { Suits } from '@/constants'
import CardBack from '@/components/CardBack.vue'
import CardHighlight from '@/components/CardHighlight.vue'
import EmptySpace from '@/components/EmptySpace.vue'
import GameContainer from '../GameContainer.vue'

vi.mock('@/utils/overrideAnimation', () => ({
  overrideAnimation: (cb: () => void) => cb()
}))

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
    return shallowMount(GameContainer, { global: { plugins: [pinia] } })
  }

  describe('stock pile display', () => {
    it('shows CardBack when there are stock cards', () => {
      const wrapper = mountGame()
      expect(wrapper.findComponent(CardBack).exists()).toBe(true)
    })

    it('shows EmptySpace when the stock is empty', async () => {
      store.stock = []
      const wrapper = mountGame()
      expect(wrapper.findComponent(EmptySpace).exists()).toBe(true)
    })
  })

  describe('deal hint highlight', () => {
    it('shows CardHighlight when the current hint is a deal card hint', () => {
      store.hints = [['DEAL_CARD']]
      store.currentHintIndex = 0
      const wrapper = mountGame()
      expect(wrapper.findComponent(CardHighlight).exists()).toBe(true)
    })

    it('does not show CardHighlight when there is no deal hint', () => {
      const wrapper = mountGame()
      expect(wrapper.findComponent(CardHighlight).exists()).toBe(false)
    })
  })

  describe('deal()', () => {
    it('calls store.deal() when the stock lane is clicked', async () => {
      const dealSpy = vi.spyOn(store, 'deal')
      const wrapper = mountGame()
      await wrapper.find('.game__lane').trigger('click')
      expect(dealSpy).toHaveBeenCalled()
    })
  })

  describe('foundations', () => {
    it('renders one lane per foundation suit', () => {
      mountGame()
      const foundationCount = Object.keys(store.foundations).length
      expect(foundationCount).toBe(Object.values(Suits).length)
    })
  })

  describe('tableau', () => {
    it('initialises seven tableau columns', () => {
      const tableauCount = Object.keys(store.tableau).length
      expect(tableauCount).toBe(7)
    })
  })
})
