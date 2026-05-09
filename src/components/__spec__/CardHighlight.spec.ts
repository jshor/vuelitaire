import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CardHighlight from '../CardHighlight.vue'

describe('CardHighlight', () => {
  it('renders the highlight element', () => {
    const wrapper = mount(CardHighlight)
    expect(wrapper.classes()).toContain('highlight')
  })

  it('renders the inner highlight element', () => {
    const wrapper = mount(CardHighlight)
    expect(wrapper.find('.highlight__inner').exists()).toBe(true)
  })
})
