import Vuex from 'vuex'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import DeckContainer from './DeckContainer'
import Card from '../store/models/Card'

const localVue = createLocalVue()

localVue.use(Vuex)

describe('Deck Container', () => {
  const cardA = new Card()
  const cardB = new Card()
  const cardC = new Card()
  const dealt = [cardA, cardB, cardC]
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(DeckContainer, {
      localVue,
      sync: false,
      store: new Vuex.Store({
        state: {
          deck: {
            waste: dealt,
            dealt
          }
        }
      })
    })
  })

  describe('shouldAcceptDrop()', () => {
    it('should return true when the dropped card is the card in the container', () => {
      const card = new Card()
      const getChildPayload = () => card

      expect(wrapper.vm.shouldAcceptDrop(card, { getChildPayload })).toEqual(true)
    })

    it('should return false when a foreign card is dropped', () => {
      const card = new Card()
      const getChildPayload = () => new Card()

      expect(wrapper.vm.shouldAcceptDrop(card, { getChildPayload })).toEqual(false)
    })
  })

  describe('getFannedPadding()', () => {
    it('should return 40 pixels for the nth card', () => {
      expect(wrapper.vm.getFannedPadding(cardC)).toEqual(40)
    })

    it('should return 40 pixels for the (n-1)th card', () => {
      expect(wrapper.vm.getFannedPadding(cardB)).toEqual(20)
    })

    it('should return 0 pixels for the (n-2)th card', () => {
      expect(wrapper.vm.getFannedPadding(cardA)).toEqual(0)
    })
  })
})
