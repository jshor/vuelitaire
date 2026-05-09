import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EmptyStockIcon from '../EmptyStockIcon.vue'

describe('EmptyStockIcon', () => {
  it('renders the empty-stock-icon element', () => {
    const wrapper = mount(EmptyStockIcon)
    expect(wrapper.classes()).toContain('empty-stock-icon')
  })
})
