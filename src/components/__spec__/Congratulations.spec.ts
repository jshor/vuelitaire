import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Congratulations from '../Congratulations.vue'

// Mock canvas-confetti to avoid browser API issues in tests
vi.mock('canvas-confetti', () => ({ default: vi.fn() }))

describe('Congratulations', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('is not visible when isActive is false', () => {
    const wrapper = mount(Congratulations, { props: { isActive: false } })
    const el = wrapper.find('.congratulations')
    expect(el.isVisible()).toBe(false)
  })

  it('is visible when isActive is true', async () => {
    const wrapper = mount(Congratulations, {
      props: { isActive: true },
      attachTo: document.body
    })
    await wrapper.vm.$nextTick()
    const el = wrapper.find('.congratulations')
    expect(el.isVisible()).toBe(true)
  })

  it('does not show the end button initially (before timer)', async () => {
    const wrapper = mount(Congratulations, { props: { isActive: true } })
    await wrapper.vm.$nextTick()
    const end = wrapper.find('.congratulations__end')
    expect(end.classes()).not.toContain('congratulations__end--visible')
  })

  it('shows the end button after 3 seconds', async () => {
    const wrapper = mount(Congratulations, { props: { isActive: true } })
    await wrapper.vm.$nextTick()
    vi.advanceTimersByTime(3001)
    await wrapper.vm.$nextTick()
    const end = wrapper.find('.congratulations__end')
    expect(end.classes()).toContain('congratulations__end--visible')
  })

  it('emits end when the end button is clicked', async () => {
    const wrapper = mount(Congratulations, { props: { isActive: true } })
    await wrapper.vm.$nextTick()
    vi.advanceTimersByTime(3001)
    await wrapper.vm.$nextTick()
    await wrapper.find('.congratulations__end').trigger('click')
    expect(wrapper.emitted('end')).toBeTruthy()
  })

  it('hides when isActive transitions from true to false', async () => {
    const wrapper = mount(Congratulations, {
      props: { isActive: true },
      attachTo: document.body
    })
    await wrapper.vm.$nextTick()
    await wrapper.setProps({ isActive: false })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.congratulations').isVisible()).toBe(false)
  })
})
