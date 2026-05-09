import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EmptySpace from '../EmptySpace.vue'

describe('EmptySpace', () => {
  it('renders the empty-space element', () => {
    const wrapper = mount(EmptySpace)
    expect(wrapper.classes()).toContain('empty-space')
  })

  it('emits click when clicked', async () => {
    const wrapper = mount(EmptySpace)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('renders slot content', () => {
    const wrapper = mount(EmptySpace, {
      slots: { default: '<span class="inner-icon" />' }
    })
    expect(wrapper.find('.inner-icon').exists()).toBe(true)
  })
})
