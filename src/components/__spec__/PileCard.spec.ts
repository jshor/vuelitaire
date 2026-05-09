import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PileCard from '../PileCard.vue'

describe('PileCard', () => {
  it('renders the pile-card element', () => {
    const wrapper = mount(PileCard, {
      props: { isTop: false, isVisible: false, index: 0 }
    })
    expect(wrapper.classes()).toContain('pile-card')
  })

  it('sets zIndex to 1 when isTop is true', () => {
    const wrapper = mount(PileCard, {
      props: { isTop: true, isVisible: false, index: 0 }
    })
    expect(wrapper.element.style.zIndex).toBe('1')
  })

  it('does not set zIndex when isTop is false', () => {
    const wrapper = mount(PileCard, {
      props: { isTop: false, isVisible: false, index: 0 }
    })
    expect(wrapper.element.style.zIndex).toBe('')
  })

  it('sets left calc when isVisible is true', () => {
    const wrapper = mount(PileCard, {
      props: { isTop: false, isVisible: true, index: 2 }
    })
    expect(wrapper.element.style.left).toContain('calc(')
    expect(wrapper.element.style.left).toContain('2 * var(--card-fanning-space)')
  })

  it('sets left to 0 when isVisible is false', () => {
    const wrapper = mount(PileCard, {
      props: { isTop: false, isVisible: false, index: 0 }
    })
    expect(wrapper.element.style.left).toBe('0px')
  })

  it('renders slot content', () => {
    const wrapper = mount(PileCard, {
      props: { isTop: false, isVisible: false, index: 0 },
      slots: { default: '<span class="slot-content">card</span>' }
    })
    expect(wrapper.find('.slot-content').exists()).toBe(true)
  })
})
