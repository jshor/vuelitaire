import { Suits } from '@/constants'
import ICard from '@/interfaces/ICard'
import ICardsState from '@/interfaces/ICardsState'
import Card from '@/models/Card'
import FoundationSpace from '@/models/FoundationSpace'
import LaneSpace from '@/models/LaneSpace'
import Pair from '@/models/Pair'
import cards from '../cards'

const { mutations } = cards

describe('Vuex cards module', () => {
  describe('mutations', () => {
    describe('REVEAL_CARDS', () => {
      it('should set all childless cards in the state to be revealed', () => {
        const a: ICard = new Card(Suits.DIAMONDS, 1)
        const b: ICard = new Card(Suits.DIAMONDS, 1)
        const c: ICard = new Card(Suits.DIAMONDS, 1)
        const state: ICardsState = {
          tableau: {},
          foundations: {},
          regular: {
            [a.id]: a,
            [b.id]: b
          }
        }

        b.child = c

        mutations.REVEAL_CARDS(state)

        expect(a.revealed).toEqual(true)
        expect(b.revealed).toEqual(false)
        expect(a.revealed).toEqual(true)
      })
    })

    describe('UNREVEAL_CARD', () => {
      it('should leave the state intact if the card having the given id is not found', () => {
        const card: Card = new Card(Suits.CLUBS, 0)
        const state: ICardsState = {
          tableau: {},
          foundations: {},
          regular: {}
        }
        const originalState: ICardsState = { ...state } as ICardsState

        mutations.UNREVEAL_CARD(state, card.id)

        expect(state).toEqual(originalState)
      })

      it('should set the revealed flag to false if the card exists in the state', () => {
        const card: Card = new Card(Suits.CLUBS, 0)
        const state: ICardsState = {
          tableau: {},
          foundations: {},
          regular: {
            [card.id]: card
          }
        }

        card.revealed = true

        mutations.UNREVEAL_CARD(state, card.id)

        expect(card.revealed).toEqual(false)
      })
    })

    describe('SET_CARD_ERROR', () => {
      it('should leave the state intact if the card having the given id is not found', () => {
        const card: Card = new Card(Suits.CLUBS, 0)
        const state: ICardsState = {
          tableau: {},
          foundations: {},
          regular: {}
        }
        const originalState: ICardsState = { ...state } as ICardsState

        mutations.SET_CARD_ERROR(state, { cardId: card.id, hasError: true })

        expect(state).toEqual(originalState)
      })

      it('should set the revealed flag to the given value if the card exists in the state', () => {
        const card: Card = new Card(Suits.CLUBS, 0)
        const state: ICardsState = {
          tableau: {},
          foundations: {},
          regular: {
            [card.id]: card
          }
        }

        card.hasError = true

        mutations.SET_CARD_ERROR(state, { cardId: card.id, hasError: true })

        expect(card.hasError).toEqual(true)
      })
    })

    describe('CLEAR_ANIMATION_INDICES', () => {
      it('should reset all animationIndex values from all cards to zero', () => {
        const a: Card = new Card(Suits.CLUBS, 0)
        const b: Card = new Card(Suits.DIAMONDS, 1)
        const c: Card = new Card(Suits.SPADES, 2)
        const state: ICardsState = {
          tableau: {},
          foundations: {},
          regular: {
            [a.id]: a,
            [b.id]: b,
            [c.id]: c
          }
        }

        a.animationIndex = 1
        b.animationIndex = 2
        c.animationIndex = 3

        mutations.CLEAR_ANIMATION_INDICES(state)

        expect(a.animationIndex).toEqual(0)
        expect(b.animationIndex).toEqual(0)
        expect(c.animationIndex).toEqual(0)
      })
    })

    describe('INIT_FOUNDATIONS', () => {
      it('should attach 4 spaces to the cards state', () => {
        const state: ICardsState = {
          tableau: {},
          foundations: {},
          regular: {}
        }

        mutations.INIT_FOUNDATIONS(state)

        expect(Object.values(state.foundations)).toHaveLength(4)
      })
    })

    describe('MOVE_CARD', () => {
      it('should move a card from an existing one in the tableaux to another', () => {
        const lane: LaneSpace = new LaneSpace()
        const oldParent: Card = new Card(Suits.CLUBS, 12)
        const newParent: Card = new Card(Suits.SPADES, 12)
        const card: Card = new Card(Suits.DIAMONDS, 11)
        const state: ICardsState = {
          foundations: {},
          tableau: {
            [lane.id]: lane
          },
          regular: {
            [oldParent.id]: oldParent,
            [newParent.id]: newParent,
            [card.id]: card
          }
        }

        oldParent.child = card
        card.parent = oldParent

        mutations.MOVE_CARD(state, new Pair(card.id, newParent.id))

        expect(newParent.child).toEqual(card)
        expect(oldParent.child).toBeNull()
        expect(card.parent).toEqual(newParent)
      })

      it('should move a card into the tableaux', () => {
        const lane: LaneSpace = new LaneSpace()
        const card: Card = new Card(Suits.CLUBS, 12)
        const state: ICardsState = {
          foundations: {},
          tableau: {
            [lane.id]: lane
          },
          regular: {
            [card.id]: card
          }
        }

        mutations.MOVE_CARD(state, new Pair(card.id, lane.id))

        expect(lane.child).toEqual(card)
        expect(card.parent).toEqual(lane)
      })

      it('should promote a card', () => {
        const foundation: FoundationSpace = new FoundationSpace()
        const card: Card = new Card(Suits.CLUBS, 0)
        const state: ICardsState = {
          foundations: {
            [foundation.id]: foundation
          },
          tableau: {},
          regular: {
            [card.id]: card
          }
        }

        mutations.MOVE_CARD(state, new Pair(card.id, foundation.id))

        expect(foundation.child).toEqual(card)
        expect(card.parent).toEqual(foundation)
        expect(card.promoted).toEqual(true)
      })
    })
  })
})
