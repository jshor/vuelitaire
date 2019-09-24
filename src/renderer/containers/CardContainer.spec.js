import Vuex from 'vuex'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import CardContainer from './CardContainer'
import Card from '../store/models/Card'

const localVue = createLocalVue()

localVue.use(Vuex)

describe('Card Container', () => {
  let wrapper
  let card

  const createWrapper = (propsData) => {
    return shallowMount(CardContainer, {
      propsData,
      localVue,
      sync: false,
      store: new Vuex.Store({
        actions: {
          moveCard: jest.fn()
        }
      })
    })
  }

  beforeEach(() => {
    card = card = new Card()
    card.child = new Card()
    card.revealed = true

    wrapper = createWrapper({
      card,
      hasChild: true
    })
  })

  describe('descendants property', () => {
    it('should return a list of all of the descendants of the card', () => {
      const descendants = CardContainer.computed.descendants.call({ card })

      expect(descendants).toHaveLength(2)
      expect(descendants).toContain(card)
      expect(descendants).toContain(card.child)
    })
  })

  describe('unturned property', () => {
    it('should return true if the card isn\'t revealed and has no child', () => {
      card.child = null
      card.revealed = false

      expect(CardContainer.computed.unturned.call({ card })).toEqual(true)
    })

    it('should return false if the card has a child', () => {
      expect(CardContainer.computed.unturned.call({ card })).toEqual(false)
    })

    it('should return false if the card is already revealed', () => {
      card.child = null
      card.revealed = true

      expect(CardContainer.computed.unturned.call({ card })).toEqual(false)
    })
  })

  describe('card drop acceptance', () => {
    it('should accept a card drop if the card has no child', () => {
      const getChildPayload = () => card
      card.child = null

      expect(wrapper.vm.shouldAcceptDrop({ getChildPayload })).toEqual(true)
    })

    it('should not accept a card drop if the card is not yet revealed', () => {
      const getChildPayload = () => card
      card.revealed = false

      expect(wrapper.vm.shouldAcceptDrop({ getChildPayload })).toEqual(false)
    })
  })

  describe('when a card is dropped', () => {
    beforeEach(() => {
      jest.spyOn(wrapper.vm, 'moveCard')
    })

    it('should not call moveCard() if the target card is not ready to accept yet', () => {
      wrapper.setData({ ready: false })
      wrapper.vm.onDrop({ payload: new Card() })

      expect(wrapper.vm.moveCard).not.toHaveBeenCalled()
    })

    it('should move the card', () => {
      const payload = new Card()

      wrapper.setData({ ready: true })
      wrapper.vm.onDrop({ payload })

      expect(wrapper.vm.moveCard).toHaveBeenCalledTimes(1)
      expect(wrapper.vm.moveCard).toHaveBeenCalledWith({
        cardId: payload.id,
        targetId: card.id
      })
    })

    it('should reset the `ready` flag', () => {
      const payload = new Card()

      wrapper.setData({ ready: true })
      wrapper.vm.onDrop({ payload })

      expect(wrapper.vm.ready).toEqual(false)
    })
  })

  describe('reveal()', () => {
    it('should set the card\'s `revealed` flag to true', () => {
      wrapper.vm.reveal()

      expect(wrapper.vm.card.revealed).toEqual(true)
    })
  })
})
