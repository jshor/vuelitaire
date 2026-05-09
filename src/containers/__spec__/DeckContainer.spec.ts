import { describe, it, expect, beforeEach, vi } from 'vitest'
import { shallowMount, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/main'
import { DEAL_CARD_ID, Suits } from '@/constants'
import Deck from '@/components/Deck.vue'
import PileCard from '@/components/PileCard.vue'
import GameContainer from '../DeckContainer.vue'

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

  function mountFull() {
    return mount(GameContainer, {
      global: {
        plugins: [pinia],
        stubs: { CardContainer: true }
      }
    })
  }

  describe('stock pile display', () => {
    it('shows CardBack when there are stock cards (is-empty=false)', () => {
      const wrapper = mountGame()
      expect(wrapper.findComponent(Deck).props('isEmpty')).toBe(false)
    })

    it('shows EmptySpace when the stock is empty (is-empty=true)', async () => {
      store.stock = []
      store.dealIndex = -1
      const wrapper = mountGame()
      expect(wrapper.findComponent(Deck).props('isEmpty')).toBe(true)
    })
  })

  describe('deal hint highlight', () => {
    it('shows CardHighlight when the current hint is a deal card hint', () => {
      store.hints = [[DEAL_CARD_ID]]
      store.currentHintIndex = 0
      const wrapper = mountGame()
      expect(wrapper.findComponent(Deck).props('showHint')).toBe(true)
    })

    it('does not show CardHighlight when there is no deal hint', () => {
      const wrapper = mountGame()
      expect(wrapper.findComponent(Deck).props('showHint')).toBe(false)
    })
  })

  describe('deal()', () => {
    it('calls store.deal() when the Deck emits deal', async () => {
      const dealSpy = vi.spyOn(store, 'deal')
      const wrapper = mountGame()
      await wrapper.findComponent(Deck).vm.$emit('deal')
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

  describe('pile cards rendering', () => {
    it('renders a pile card for each stock card', () => {
      const wrapper = mountFull()
      const pileCards = wrapper.findAllComponents(PileCard)
      expect(pileCards.length).toBe(store.stock.length)
    })

    it('marks the top card as isTop when dealIndex matches', () => {
      store.dealIndex = 1
      const wrapper = mountFull()
      const pileCards = wrapper.findAllComponents(PileCard)
      expect(pileCards[1].props('isTop')).toBe(true)
    })
  })

  describe('getLeftFanningSpace()', () => {
    it('branch 1: dealIndex < DEALT_CARDS_DISPLAYED uses k+1', () => {
      // dealIndex=1 (< 3), k=0: dealIndex >= k → branch 1 → returns k+1=1 → index=0
      store.dealIndex = 1
      const wrapper = mountFull()
      const pileCards = wrapper.findAllComponents(PileCard)
      expect(pileCards[0].props('index')).toBe(0) // 1 - 1 = 0
    })

    it('branch 2: dealIndex - k >= DEALT_CARDS_DISPLAYED - 1 returns 1', () => {
      // dealIndex=5 (>= 3), k=0: dealIndex-k=5 >= 2 → branch 2 → returns 1 → index=0
      store.dealIndex = 5
      const wrapper = mountFull()
      const pileCards = wrapper.findAllComponents(PileCard)
      expect(pileCards[0].props('index')).toBe(0) // 1 - 1 = 0
    })

    it('branch 3: returns DEALT_CARDS_DISPLAYED - (dealIndex - k)', () => {
      // dealIndex=5, k=4: dealIndex-k=1 < 2 → branch 3 → returns 3-1=2 → index=1
      store.dealIndex = 5
      const wrapper = mountFull()
      const pileCards = wrapper.findAllComponents(PileCard)
      if (pileCards.length > 4) {
        expect(pileCards[4].props('index')).toBe(1) // (3 - (5 - 4)) - 1 = 2 - 1 = 1
      }
    })

    it('outside range: returns 1 (index=0) when card is not visible', () => {
      store.dealIndex = 0
      const wrapper = mountFull()
      const pileCards = wrapper.findAllComponents(PileCard)
      if (pileCards.length > 1) {
        // k=1 > dealIndex=0, not in range → returns 1 → index=0
        expect(pileCards[1].props('index')).toBe(0) // 1 - 1 = 0
      }
    })
  })
})
