import { Suits } from '@/constants'
import ICard from '@/interfaces/ICard'
import Card from '@/models/Card'
import Pair from '@/models/Pair'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import CardContainer from '../CardContainer'

const localVue = createLocalVue()

localVue.use(Vuex)

describe('Card Container', () => {
  let wrapper
  let card: Card

  const createWrapper = (propsData) => {
    return shallowMount(CardContainer, {
      propsData,
      localVue,
      store: new Vuex.Store({
        actions: {
          moveCard: jest.fn(),
          setSelection: jest.fn(),
          autoplayCard: jest.fn()
        },
        getters: {
          highlightedCards: jest.fn(() => [])
        },
        modules: {
          settings: {
            namespaced: true,
            getters: {
              backface: jest.fn(() => ({}))
            }
          }
        }
      })
    })
  }

  beforeEach(() => {
    card = new Card(Suits.DIAMONDS, 1)
    card.child = new Card(Suits.DIAMONDS, 1)
    card.revealed = true

    wrapper = createWrapper({
      card,
      hasChild: true
    })
  })

  describe('descendants property', () => {
    it('should return a list of all of the descendants of the card', () => {
      const descendants = (wrapper.vm as any).descendants

      expect(descendants).toHaveLength(2)
      expect(descendants).toContain(card)
      expect(descendants).toContain(card.child)
    })
  })

  describe('canReveal property', () => {
    it('should return false if the card has a child', () => {
      expect((wrapper.vm as any).canReveal).toEqual(false)
    })

    it('should return false if the card is already revealed', () => {
      card.child = null
      card.revealed = true

      expect((wrapper.vm as any).canReveal).toEqual(false)
    })
  })

  describe('onDragEnter()', () => {
    it('should set the `ready` flag to true', () => {
      wrapper.vm.onDragEnter()

      expect(wrapper.vm.ready).toEqual(true)
    })
  })

  describe('onDragLeave()', () => {
    it('should set the `ready` flag to false', () => {
      wrapper.vm.onDragLeave()

      expect(wrapper.vm.ready).toEqual(false)
    })
  })

  describe('card drop acceptance', () => {
    it('should accept a card drop if the dropped card is the parent card\'s child', () => {
      const getChildPayload = () => card.child

      expect(wrapper.vm.shouldAcceptDrop({ getChildPayload })).toEqual(true)
    })

    // it('should not accept a card drop if the card is an ancestor of the current card', () => {
    //   const parentCard = new Card(Suits.DIAMONDS, 1)
    //   const parentWrapper = createWrapper({
    //     card: parentCard,
    //     hasChild: true
    //   })
    //   wrapper = createWrapper({
    //     card,
    //     hasChild: true,
    //     children: [parentWrapper]
    //   })
    //   const getChildPayload = () => card

    //   expect(parentWrapper.vm.shouldAcceptDrop({ getChildPayload })).toEqual(false)
    // })

    it('should accept the card if the dropped card meets the parent card\'s requirements', () => {
      const droppedCard = new Card(Suits.DIAMONDS, 1)
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
      wrapper.vm.onDrop({ payload: new Card(Suits.DIAMONDS, 1) })

      expect(wrapper.vm.moveCard).not.toHaveBeenCalled()
    })

    it('should not call moveCard() if the target card is descendant of the parent', () => {
      wrapper.setData({ ready: true })
      wrapper.vm.onDrop({ payload: card.child })

      expect(wrapper.vm.moveCard).not.toHaveBeenCalled()
    })

    it('should move the card', () => {
      const payload: ICard = new Card(Suits.DIAMONDS, 1)

      wrapper.setData({ ready: true })
      wrapper.vm.onDrop({ payload })

      expect(wrapper.vm.moveCard).toHaveBeenCalledTimes(1)
      expect(wrapper.vm.moveCard).toHaveBeenCalledWith(new Pair(payload.id, card.id))
    })

    it('should reset the `ready` flag', () => {
      const payload: ICard = new Card(Suits.DIAMONDS, 1)

      wrapper.setData({ ready: true })
      wrapper.vm.onDrop({ payload })

      expect(wrapper.vm.ready).toEqual(false)
    })
  })

  describe('selectCard()', () => {
    const card: ICard = new Card(Suits.DIAMONDS, 1)
    const child: ICard = new Card(Suits.DIAMONDS, 1)

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
