import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import Game from '../Game.vue'

vi.mock('canvas-confetti', () => ({ default: vi.fn() }))

const CongratulationsStub = defineComponent({
  name: 'Congratulations',
  props: ['isActive'],
  emits: ['end'],
  template: '<div class="congratulations-stub" />'
})

describe('Game', () => {
  function mountGame(props = {}) {
    return mount(Game, {
      props: { isPaused: false, isComplete: false, ...props },
      global: {
        components: { Congratulations: CongratulationsStub }
      }
    })
  }

  it('renders the game element', () => {
    const wrapper = mountGame()
    expect(wrapper.classes()).toContain('game')
  })

  it('does not apply paused class when isPaused is false', () => {
    const wrapper = mountGame({ isPaused: false })
    expect(wrapper.find('.game__main').classes()).not.toContain('game__main--paused')
  })

  it('applies paused class when isPaused is true', () => {
    const wrapper = mountGame({ isPaused: true })
    expect(wrapper.find('.game__main').classes()).toContain('game__main--paused')
  })

  it('does not show the paused overlay when isPaused is false', () => {
    const wrapper = mountGame({ isPaused: false })
    expect(wrapper.find('.game__paused').exists()).toBe(false)
  })

  it('shows the paused overlay when isPaused is true', () => {
    const wrapper = mountGame({ isPaused: true })
    expect(wrapper.find('.game__paused').exists()).toBe(true)
  })

  it('renders the dealer slot', () => {
    const wrapper = mount(Game, {
      props: { isPaused: false, isComplete: false },
      global: {
        components: { Congratulations: CongratulationsStub }
      },
      slots: { dealer: '<span class="dealer-slot">deal</span>' }
    })
    expect(wrapper.find('.dealer-slot').exists()).toBe(true)
  })

  it('renders the actions slot', () => {
    const wrapper = mount(Game, {
      props: { isPaused: false, isComplete: false },
      global: {
        components: { Congratulations: CongratulationsStub }
      },
      slots: { actions: '<button class="action-slot">btn</button>' }
    })
    expect(wrapper.find('.action-slot').exists()).toBe(true)
  })

  it('emits end event from congratulations component', async () => {
    const wrapper = mountGame({ isComplete: true })
    const congratulations = wrapper.findComponent(CongratulationsStub)
    await congratulations.vm.$emit('end')
    expect(wrapper.emitted('end')).toBeTruthy()
  })
})
