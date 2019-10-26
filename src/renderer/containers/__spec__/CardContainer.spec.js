import Vuex from 'vuex'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import CardContainer from '../CardContainer'
import Card from '../../store/models/Card'

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
          moveCard: jest.fn(),
          setSelection: jest.fn()
        },
        getters: {
          highlightedCards: jest.fn(() => [])
        }
      })
    })
  }

  beforeEach(() => {
    card = new Card()
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

  describe('canReveal property', () => {
    it('should return true if the card isn\'t revealed and has no child', () => {
      card.child = null
      card.revealed = false

      expect(CardContainer.computed.canReveal.call({ card })).toEqual(true)
    })

    it('should return false if the card has a child', () => {
      expect(CardContainer.computed.canReveal.call({ card })).toEqual(false)
    })

    it('should return false if the card is already revealed', () => {
      card.child = null
      card.revealed = true

      expect(CardContainer.computed.canReveal.call({ card })).toEqual(false)
    })
  })

  describe('card drop acceptance', () => {
    it('should accept a card drop if the dropped card is the parent card\'s child', () => {
      const getChildPayload = () => card.child

      expect(wrapper.vm.shouldAcceptDrop({ getChildPayload })).toEqual(true)
    })

    it('should not accept a card drop if the card is an ancestor of the current card', () => {
      const parentCard = new Card()
      const parentWrapper = createWrapper({
        card: parentCard,
        hasChild: true
      })
      wrapper = createWrapper({
        card,
        hasChild: true,
        children: [parentWrapper]
      })
      const getChildPayload = () => card

      expect(parentWrapper.vm.shouldAcceptDrop({ getChildPayload })).toEqual(false)
    })

    it('should accept the card if the dropped card meets the parent card\'s requirements', () => {
      const droppedCard = new Card()
      const getChildPayload = () => droppedCard

      card.child = null
      jest
        .spyOn(card, 'canAcceptCard')
        .mockReturnValue(true)

      expect(wrapper.vm.shouldAcceptDrop({ getChildPayload })).toEqual(true)
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

    it('should not call moveCard() if the target card is descendant of the parent', () => {
      wrapper.setData({ ready: true })
      wrapper.vm.onDrop({ payload: card.child })

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

  describe('selectCard()', () => {
    const card = new Card()
    const child = new Card()

    beforeEach(() => {
      card.child = child
      card.revealed = true
      child.revealed = true
    })

    it('should not call autoplayCard() or setSelection() if the card is not ready', () => {
      wrapper.setData({ ready: true })
      jest.spyOn(wrapper.vm, 'autoplayCard')
      jest.spyOn(wrapper.vm, 'setSelection')

      wrapper.vm.selectCard()

      expect(wrapper.vm.autoplayCard).not.toHaveBeenCalled()
      expect(wrapper.vm.setSelection).not.toHaveBeenCalled()
    })

    it('should not call autoplayCard() or setSelection() if the card is not ready', () => {
      wrapper.setData({ ready: true })
      jest.spyOn(wrapper.vm, 'autoplayCard')
      jest.spyOn(wrapper.vm, 'setSelection')

      wrapper.vm.selectCard()

      expect(wrapper.vm.autoplayCard).not.toHaveBeenCalled()
      expect(wrapper.vm.setSelection).not.toHaveBeenCalled()
    })

    describe('when the card is double-clicked', () => {
      it('should call autoplayCard() with the card\'s child if it has one', () => {
        wrapper = createWrapper({
          card,
          hasChild: true,
          isSpace: false
        })
        jest.spyOn(wrapper.vm, 'autoplayCard')

        wrapper.setData({ ready: false })
        wrapper.vm.selectCard(true)

        expect(wrapper.vm.autoplayCard).toHaveBeenCalledTimes(1)
        expect(wrapper.vm.autoplayCard).toHaveBeenCalledWith(child)
      })

      it('should call autoplayCard() with the card itself if it does not have a child', () => {
        card.child = null
        wrapper = createWrapper({
          card,
          hasChild: false,
          isSpace: false
        })
        jest.spyOn(wrapper.vm, 'autoplayCard')

        wrapper.setData({ ready: false })
        wrapper.vm.selectCard(true)

        expect(wrapper.vm.autoplayCard).toHaveBeenCalledTimes(1)
        expect(wrapper.vm.autoplayCard).toHaveBeenCalledWith(card)
      })
    })

    describe('when the card is clicked once', () => {
      it('should call selectCard() with the card\'s child if it has one', () => {
        wrapper = createWrapper({
          card,
          hasChild: true,
          isSpace: false
        })
        jest.spyOn(wrapper.vm, 'setSelection')

        wrapper.setData({ ready: false })
        wrapper.vm.selectCard(false)

        expect(wrapper.vm.setSelection).toHaveBeenCalledTimes(1)
        expect(wrapper.vm.setSelection).toHaveBeenCalledWith(child)
      })

      it('should call selectCard() with the card itself if it does not have a child', () => {
        card.child = null
        wrapper = createWrapper({
          card,
          hasChild: false,
          isSpace: false
        })
        jest.spyOn(wrapper.vm, 'setSelection')

        wrapper.setData({ ready: false })
        wrapper.vm.selectCard(false)

        expect(wrapper.vm.setSelection).toHaveBeenCalledTimes(1)
        expect(wrapper.vm.setSelection).toHaveBeenCalledWith(card)
      })
    })
  })
})
