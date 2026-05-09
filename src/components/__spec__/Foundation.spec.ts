import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Suits } from '@/constants'
import Foundation from '../Foundation.vue'

describe('Foundation', () => {
  it('renders clubs icon for CLUBS suit', () => {
    const wrapper = mount(Foundation, { props: { suit: Suits.CLUBS } })
    expect(wrapper.text()).toBe('♣')
  })

  it('renders diamonds icon for DIAMONDS suit', () => {
    const wrapper = mount(Foundation, { props: { suit: Suits.DIAMONDS } })
    expect(wrapper.text()).toBe('♦')
  })

  it('renders hearts icon for HEARTS suit', () => {
    const wrapper = mount(Foundation, { props: { suit: Suits.HEARTS } })
    expect(wrapper.text()).toBe('♥')
  })

  it('renders spades icon for SPADES suit (default)', () => {
    const wrapper = mount(Foundation, { props: { suit: Suits.SPADES } })
    expect(wrapper.text()).toBe('♠')
  })

  it('renders the foundation element', () => {
    const wrapper = mount(Foundation, { props: { suit: Suits.CLUBS } })
    expect(wrapper.classes()).toContain('foundation')
  })
})
