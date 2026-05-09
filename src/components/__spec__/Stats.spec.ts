import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Stats from '../Stats.vue'

describe('Stats', () => {
  function mountStats(props = {}) {
    return mount(Stats, {
      global: { components: { FontAwesomeIcon } },
      props
    })
  }

  it('renders the stats element', () => {
    const wrapper = mountStats()
    expect(wrapper.classes()).toContain('stats')
  })

  it('displays formatted score from points prop', () => {
    const wrapper = mountStats({ points: 1500 })
    expect(wrapper.text()).toContain('1,500')
  })

  it('displays 0 score by default', () => {
    const wrapper = mountStats()
    expect(wrapper.text()).toContain('0')
  })

  it('displays formatted clock from timeElapsed prop', () => {
    const wrapper = mountStats({ timeElapsed: 75 })
    // 75 seconds = 1:15
    expect(wrapper.text()).toContain('1:15')
  })

  it('does not have paused class when isPaused is false', () => {
    const wrapper = mountStats({ isPaused: false })
    expect(wrapper.find('.stats__time').classes()).not.toContain('stats__time--paused')
  })

  it('adds paused class when isPaused is true', () => {
    const wrapper = mountStats({ isPaused: true })
    expect(wrapper.find('.stats__time').classes()).toContain('stats__time--paused')
  })

  it('uses default props when none provided', () => {
    const wrapper = mountStats()
    // Default timeElapsed=0 → formatClock returns 0
    expect(wrapper.text()).toContain('0')
    expect(wrapper.find('.stats__time').classes()).not.toContain('stats__time--paused')
  })
})
