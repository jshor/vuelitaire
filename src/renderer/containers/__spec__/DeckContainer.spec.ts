import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import Card from '../../models/Card'
import DeckContainer from '../DeckContainer.vue'
import { Suits } from '../../constants'

const localVue = createLocalVue()

localVue.use(Vuex)

describe('Deck Container', () => {
  const cardA: Card = new Card(Suits.DIAMONDS, 1)
  const cardB: Card = new Card(Suits.DIAMONDS, 1)
  const cardC: Card = new Card(Suits.DIAMONDS, 1)
  const dealt: Card[] = [cardA, cardB, cardC]
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
      const card: Card = new Card(Suits.DIAMONDS, 1)
      const getChildPayload = () => card

      expect(wrapper.vm.shouldAcceptDrop(card, { getChildPayload })).toEqual(true)
    })

    it('should return false when a foreign card is dropped', () => {
      const card: Card = new Card(Suits.DIAMONDS, 1)
      const getChildPayload = () => new Card(Suits.DIAMONDS, 1)

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
      expect(wrapper.vm.isNth(new Card(Suits.DIAMONDS, 1), 1)).toEqual(false)
    })
  })
})
