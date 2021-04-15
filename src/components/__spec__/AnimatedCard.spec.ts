import { shallowMount } from '@vue/test-utils'
import AnimatedCard from '../AnimatedCard'

describe('Animated Card component', () => {
  let wrapper
  const cardId = 'some-card-id'
  const targetId = 'some-target-id'

  beforeEach(() => {
    wrapper = shallowMount(AnimatedCard, {
      propsData: {
        cardId,
        targetId
      }
    })
  })

  afterEach(() => jest.resetAllMocks())

  it('should render contents correctly', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })

  describe('cloneCard()', () => {
    afterEach(() => {
      document.body.innerHTML = ''
    })

    describe('when the card exists', () => {
      const elem = document.createElement('div')

      beforeEach(() => {
        elem.dataset.id = cardId
        document.body.appendChild(elem)
        wrapper.vm.cloneCard(cardId)
      })

      it('should insert a cloned version of the card into the component', () => {
        expect(wrapper.find(`[data-id="${cardId}"]`).exists()).toBe(true)
      })

      it('should set the opacity of the cloned element to 0', () => {
        expect(wrapper.find(`[data-id="${cardId}"]`).attributes('style')).toContain('opacity: 0')
      })
    })

    it('should clear the component if the card does not exist in the DOM', () => {
      const elem = document.createElement('div')
      const bogusId = 'bogus-id'

      elem.dataset.id = cardId
      document.body.appendChild(elem)
      wrapper.vm.cloneCard(cardId) // make a valid addition to the DOM first
      wrapper.vm.cloneCard(bogusId) // make a bogus reference to clear the DOM

      expect(wrapper.find('.animated-card__inner').isEmpty()).toBe(true)
    })
  })

  it('should clone the card element when the cardId changes', () => {
    const newCardId = 'new-card-id'

    jest.spyOn(wrapper.vm, 'cloneCard')
    wrapper.setProps({ cardId: newCardId })

    expect(wrapper.vm.cloneCard).toHaveBeenCalledTimes(1)
    expect(wrapper.vm.cloneCard).toHaveBeenCalledWith(newCardId)
  })
})
