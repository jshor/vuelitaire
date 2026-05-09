import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Felt from '../Felt.vue'

describe('Felt', () => {
  it('renders the felt element', () => {
    const wrapper = mount(Felt)
    expect(wrapper.classes()).toContain('felt')
  })

  it('renders slot content', () => {
    const wrapper = mount(Felt, {
      slots: { default: '<span class="slot-content">content</span>' }
    })
    expect(wrapper.find('.slot-content').exists()).toBe(true)
  })
})
