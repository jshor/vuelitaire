import ICard from '../../../../interfaces/ICard'
import ICardsState from '../../../../interfaces/ICardsState'
import Card from '../../../../models/Card'
import FoundationSpace from '../../../../models/FoundationSpace'
import LaneSpace from '../../../../models/LaneSpace'
import Pair from '../../../../models/Pair'
import cards from '../cards'
import { Suits } from '../../../../constants'

const { getters, mutations } = cards

describe('Vuex cards module', () => {
  describe('getters', () => {
    // helper: creates a card map state containing n elements of ICard
    const createState = (n: number, fn: () => ICard): ICardsState => Array(n)
      .fill(null)
      .map(fn)
      .reduce((s: ICardsState, c: ICard) => ({ ...s, [c.id]: c }), {})

    describe('tableau', () => {
      it('should return an array of 7 tableau space cards', () => {
        const state: ICardsState = createState(7, () => new LaneSpace())
        const tableau: LaneSpace[] = getters.tableau(state, null, null, null)

        expect.assertions(8)
        expect(tableau).toHaveLength(7)
        tableau.forEach((t) => expect(t).toBeInstanceOf(LaneSpace))
      })
    })

    describe('foundations', () => {
      it('should return an array of 4 foundation space cards', () => {
        const state: ICardsState = createState(4, () => new FoundationSpace())
        const foundations: FoundationSpace[] = getters.foundations(state, null, null, null)

        expect.assertions(5)
        expect(foundations).toHaveLength(4)
        foundations.forEach((t) => expect(t).toBeInstanceOf(FoundationSpace))
      })
    })
  })

  describe('mutations', () => {
    describe('REVEAL_CARDS', () => {
      it('should set all childless cards in the state to be revealed', () => {
        const a: ICard = new Card(Suits.DIAMONDS, 1)
        const b: ICard = new Card(Suits.DIAMONDS, 1)
        const c: ICard = new Card(Suits.DIAMONDS, 1)
        const state: ICardsState = {
          [a.id]: a,
          [b.id]: b
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
        const state: ICardsState = {}
        const originalState: ICardsState = <ICardsState>{ ...state }

        mutations.UNREVEAL_CARD(state, card.id)

        expect(state).toEqual(originalState)
      })

      it('should set the revealed flag to false if the card exists in the state', () => {
        const card: Card = new Card(Suits.CLUBS, 0)
        const state: ICardsState = {
          [card.id]: card
        }
        const originalState: ICardsState = <ICardsState>{ ...state }

        card.revealed = true

        mutations.UNREVEAL_CARD(state, card.id)

        expect(state[card.id].revealed).toEqual(false)
      })
    })

    describe('CLEAR_ANIMATION_INDICES', () => {
      it('should reset all animationIndex values from all cards to zero', () => {
        const a: Card = new Card(Suits.CLUBS, 0)
        const b: Card = new Card(Suits.DIAMONDS, 1)
        const c: Card = new Card(Suits.SPADES, 2)
        const state: ICardsState = {
          [a.id]: a,
          [b.id]: b,
          [c.id]: c
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
        const state: ICardsState = {}

        mutations.INIT_FOUNDATIONS(state)

        const foundations = Object.values(state).filter((t) => t instanceof FoundationSpace)

        expect(foundations).toHaveLength(4)
      })
    })

    describe('MOVE_CARD', () => {
      let a: ICard
      let b: ICard
      let c: ICard
      let state: ICardsState

      beforeEach(() => {
        a = new Card(Suits.DIAMONDS, 1)
        b = new Card(Suits.DIAMONDS, 1)
        c = new Card(Suits.DIAMONDS, 1)

        state = {
          [a.id]: a,
          [b.id]: b,
          [c.id]: c
        }
        a.child = b
      })

      it('should set the child of the previous parent to null', () => {
        const cardId: string = b.id
        const targetId: string = c.id

        mutations.MOVE_CARD(state, new Pair(cardId, targetId))

        expect(a.child).toBeNull()
      })

      it('should set the child of the target to the moving card', () => {
        const cardId: string = b.id
        const targetId: string = c.id

        mutations.MOVE_CARD(state, new Pair(cardId, targetId))

        expect(c.child).toEqual(b)
      })

      it('should not mutate the state if the moving card is the same as its parent', () => {
        const cardId: string = c.id
        const targetId: string = a.id

        mutations.MOVE_CARD(state, new Pair(cardId, targetId))

        expect(state[a.id]).toEqual(a)
        expect(state[b.id]).toEqual(b)
        expect(state[c.id]).toEqual(c)
      })

      it('should not remove the child card from its parent if it is an orphan', () => {
        const originalState = { ...state }
        const cardId = b.id
        const targetId = b.id

        mutations.MOVE_CARD(state, new Pair(cardId, targetId))

        expect(state).toEqual(originalState)
      })
    })
  })
})
