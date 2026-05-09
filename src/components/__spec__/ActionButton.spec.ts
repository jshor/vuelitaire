import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import ActionButton from '../ActionButton.vue'

describe('ActionButton', () => {
  function mount(props: Record<string, unknown> = {}, slot = 'Click me') {
    return shallowMount(ActionButton, {
      props,
      slots: { default: slot }
    })
  }

  it('renders a button element', () => {
    const wrapper = mount()
    expect(wrapper.element.tagName).toBe('BUTTON')
  })

  it('renders slot content', () => {
    const wrapper = mount({}, 'Deal')
    expect(wrapper.text()).toContain('Deal')
  })

  it('is not disabled by default', () => {
    const wrapper = mount()
    expect(wrapper.attributes('disabled')).toBeUndefined()
  })

  it('is disabled when disabled prop is true', () => {
    const wrapper = mount({ disabled: true })
    expect(wrapper.element.hasAttribute('disabled')).toBe(true)
  })

  it('renders FontAwesomeIcon when icon prop is provided', () => {
    const wrapper = mount({ icon: faStar })
    expect(wrapper.html()).toContain('font-awesome-icon')
  })

  it('does not render FontAwesomeIcon when icon prop is not provided', () => {
    const wrapper = mount()
    expect(wrapper.html()).not.toContain('font-awesome-icon')
  })

  it('has the action-button class', () => {
    const wrapper = mount()
    expect(wrapper.classes()).toContain('action-button')
  })

  it('has the action-button--green class', () => {
    const wrapper = mount()
    expect(wrapper.classes()).toContain('action-button--green')
  })
})
