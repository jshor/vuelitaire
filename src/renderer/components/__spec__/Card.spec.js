import Card from '../Card'
import { shallowMount } from '@vue/test-utils'
import { Suits } from '../../constants'

describe('Animated Card component', () => {
  let wrapper

  beforeAll(() => {
    const dealCard = document.createElement('div')

    dealCard.dataset.id = 'DEAL_CARD'
    dealCard.style.left = '25px'
    dealCard.style.top = '35px'

    document.body.appendChild(dealCard)
  })

  beforeEach(() => {
    wrapper = shallowMount(Card, {
      propsData: {
        suit: Suits.HEARTS,
        rank: 1,
        revealed: true
      }
    })
  })

  afterEach(() => jest.resetAllMocks())

  it('should set left, top, and index css variables relative to the deal card position', () => {
    const animationIndex = 2

    wrapper = shallowMount(Card, {
      propsData: {
        suit: Suits.HEARTS,
        rank: 1,
        revealed: true,
        animationIndex
      }
    })

    expect(wrapper.vm.style).toHaveProperty('--left')
    expect(wrapper.vm.style['--left']).toEqual('0px')
    expect(wrapper.vm.style).toHaveProperty('--top')
    expect(wrapper.vm.style['--top']).toEqual('0px')
    expect(wrapper.vm.style).toHaveProperty('--index')
    expect(wrapper.vm.style['--index']).toEqual(animationIndex)
  })
})
