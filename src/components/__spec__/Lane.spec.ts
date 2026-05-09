import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Lane from '../Lane.vue'

describe('Lane', () => {
  it('renders the lane element', () => {
    const wrapper = mount(Lane)
    expect(wrapper.classes()).toContain('lane')
  })

  it('renders slot content', () => {
    const wrapper = mount(Lane, {
      slots: { default: '<span class="slot-content">content</span>' }
    })
    expect(wrapper.find('.slot-content').exists()).toBe(true)
  })
})
