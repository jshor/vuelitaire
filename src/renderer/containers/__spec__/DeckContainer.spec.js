import Vuex from 'vuex'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import DeckContainer from '../DeckContainer'
import Card from '../../store/models/Card'

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
        modules: {
          deck: {
            namespaced: true,
            state: {
              waste: dealt,
              dealt
            }
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

  describe('isNth()', () => {
    it('should return true if the card is the last in the dealt hand', () => {
      expect(wrapper.vm.isNth(cardC, 2)).toEqual(true)
    })

    it('should return true if the card is the middle in the dealt hand', () => {
      expect(wrapper.vm.isNth(cardB, 1)).toEqual(true)
    })

    it('should return false if the card is not equal to `n`', () => {
      expect(wrapper.vm.isNth(cardA, 1)).toEqual(false)
    })

    it('should return false if the card is not in the dealt hand', () => {
      expect(wrapper.vm.isNth(new Card(), 1)).toEqual(false)
    })
  })
})
