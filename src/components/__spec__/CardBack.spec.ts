import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CardBack from '../CardBack.vue'

describe('CardBack', () => {
  it('renders the card-back div', () => {
    const wrapper = mount(CardBack)
    expect(wrapper.classes()).toContain('card-back')
  })

  it('applies a linear-gradient background style', () => {
    const wrapper = mount(CardBack)
    expect(wrapper.element.style.background).toContain('linear-gradient')
  })
})
