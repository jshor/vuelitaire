import { describe, it, expect } from 'vitest'
import { shallowMount, mount } from '@vue/test-utils'
import Deck from '../Deck.vue'
import CardBack from '../CardBack.vue'
import EmptySpace from '../EmptySpace.vue'
import CardHighlight from '../CardHighlight.vue'
import EmptyStockIcon from '../EmptyStockIcon.vue'

describe('Deck', () => {
  function mountDeck(props: Record<string, unknown> = {}) {
    return shallowMount(Deck, {
      props: {
        showHint: false,
        isEmpty: false,
        ...props
      }
    })
  }

  it('renders the deck element', () => {
    const wrapper = mountDeck()
    expect(wrapper.classes()).toContain('deck')
  })

  it('renders CardBack when isEmpty is false', () => {
    const wrapper = mountDeck({ isEmpty: false })
    expect(wrapper.findComponent(CardBack).exists()).toBe(true)
    expect(wrapper.findComponent(EmptySpace).exists()).toBe(false)
  })

  it('renders EmptySpace when isEmpty is true', () => {
    const wrapper = mountDeck({ isEmpty: true })
    expect(wrapper.findComponent(EmptySpace).exists()).toBe(true)
    expect(wrapper.findComponent(CardBack).exists()).toBe(false)
  })

  it('renders EmptyStockIcon inside EmptySpace when isEmpty is true', () => {
    const wrapper = mount(Deck, {
      props: { showHint: false, isEmpty: true }
    })
    expect(wrapper.findComponent(EmptyStockIcon).exists()).toBe(true)
  })

  it('renders CardHighlight when showHint is true', () => {
    const wrapper = mountDeck({ showHint: true })
    expect(wrapper.findComponent(CardHighlight).exists()).toBe(true)
  })

  it('does not render CardHighlight when showHint is false', () => {
    const wrapper = mountDeck({ showHint: false })
    expect(wrapper.findComponent(CardHighlight).exists()).toBe(false)
  })

  it('emits deal when the dealer area is clicked', async () => {
    const wrapper = mountDeck()
    await wrapper.find('.deck__dealer').trigger('click')
    expect(wrapper.emitted('deal')).toBeTruthy()
  })

  it('renders the slot content in the pile area', () => {
    const wrapper = shallowMount(Deck, {
      props: { showHint: false, isEmpty: false },
      slots: { default: '<div class="pile-slot-test" />' }
    })
    expect(wrapper.find('.pile-slot-test').exists()).toBe(true)
  })
})
