import { values } from 'lodash'
import BaseModel from '../../../models/BaseModel'
import Card from '../../../models/Card'
import FoundationSpace from '../../../models/FoundationSpace'
import LaneSpace from '../../../models/LaneSpace'
import Pair from '../../../models/Pair'
import cards, { CardsState } from '../cards'

const { getters, mutations } = cards

describe('Vuex cards module', () => {
  describe('getters', () => {
    // helper: creates a card map state containing n elements of BaseModel
    const createState = (n: number, fn: () => BaseModel): CardsState => Array(n)
      .fill(null)
      .map(fn)
      .reduce((s: any, c: BaseModel) => ({ ...s, [c.id]: c }), {})

    describe('tableau', () => {
      it('should return an array of 7 tableau space cards', () => {
        const state: CardsState = createState(7, () => new LaneSpace())
        const tableau: LaneSpace[] = getters.tableau(state)

        expect.assertions(8)
        expect(tableau).toHaveLength(7)
        tableau.forEach((t) => expect(t.type).toEqual('LaneSpace'))
      })
    })

    describe('foundations', () => {
      it('should return an array of 4 foundation space cards', () => {
        const state: CardsState = createState(4, () => new FoundationSpace())
        const foundations: FoundationSpace[] = getters.foundations(state)

        expect.assertions(5)
        expect(foundations).toHaveLength(4)
        foundations.forEach((t) => expect(t.type).toEqual('FoundationSpace'))
      })
    })
  })

  describe('mutations', () => {
    describe('REVEAL_CARDS', () => {
      it('should set all childless cards in the state to be revealed', () => {
        const a: BaseModel = new Card()
        const b: BaseModel = new Card()
        const c: BaseModel = new Card()
        const state: CardsState = {
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

    describe('INIT_FOUNDATIONS', () => {
      it('should attach 4 spaces to the cards state', () => {
        const state: CardsState = {}

        mutations.INIT_FOUNDATIONS(state)

        const foundations = values(state).filter((t) => t.type === 'FoundationSpace')

        expect(foundations).toHaveLength(4)
      })
    })

    describe('MOVE_CARD', () => {
      let a: BaseModel
      let b: BaseModel
      let c: BaseModel
      let state: CardsState

      beforeEach(() => {
        a = new Card()
        b = new Card()
        c = new Card()

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
