import cards from './cards'
import Card from '../models/Card'
import Space from '../models/Space'
import getDescendants from '../../utils/getDescendants'

const { getters, mutations } = cards

describe('Vuex cards module', () => {
  describe('getters', () => {
    const createState = (n, type) => Array(n)
      .fill(null)
      .map(() => new Space(type))
      .reduce((s, c) => ({ ...s, [c.id]: c }), {})

    describe('tableau', () => {
      it('should return an array of 7 tableau space cards', () => {
        const state = createState(7, 'TABLEAU')
        const tableau = getters.tableau(state)

        expect.assertions(8)
        expect(tableau).toHaveLength(7)
        tableau.forEach(t => expect(t.constructor.name).toEqual('Space'))
      })
    })

    describe('foundations', () => {
      it('should return an array of 4 foundation space cards', () => {
        const state = createState(4, 'FOUNDATION')
        const foundations = getters.foundations(state)

        expect.assertions(5)
        expect(foundations).toHaveLength(4)
        foundations.forEach(t => expect(t.constructor.name).toEqual('Space'))
      })
    })
  })

  describe('mutations', () => {
    describe('REGISTER_CARDS', () => {
      it('should register all cards in the given deck', () => {
        const deck = Array(52)
          .fill(null)
          .map(() => new Card())
        const state = {}

        mutations.REGISTER_CARDS(state, deck)

        expect(Object.keys(state)).toHaveLength(52)
        deck.forEach(c => {
          expect(state).toHaveProperty(c.id)
          expect(state[c.id]).toEqual(c)
        })
      })
    })

    describe('INIT_TABLEAU', () => {
      let deck = []

      beforeEach(() => {
        // create a deck of 52 cards
        deck = Array(52)
          .fill(null)
          .map(() => new Card())
      })

      const createState = d => d.reduce((state, c) => ({
        ...state,
        [c.id]: c
      }), {})

      it('should apply 7 space cards to the state', () => {
        const state = createState(deck)

        mutations.INIT_TABLEAU(state, deck)

        const spaces = Object
          .values(state)
          .filter(t => t.constructor.name === 'Space')

        expect(spaces).toHaveLength(7)
      })

      it('should create a hierarchy of (n + 2) cards for each nth index', () => {
        const state = createState(deck)

        mutations.INIT_TABLEAU(state, deck)

        expect.assertions(7)
        Object
          .values(state)
          .filter(t => t.constructor.name === 'Space')
          .forEach((space, index) => {
            expect(getDescendants(space)).toHaveLength(index + 2)
          })
      })
    })

    describe('INIT_FOUNDATIONS', () => {
      it('should attach 4 spaces to the cards state', () => {
        const state = {}

        mutations.INIT_FOUNDATIONS(state)

        const foundations = Object
          .values(state)
          .filter(t => t.constructor.name === 'Space')

        expect(foundations).toHaveLength(4)
      })
    })

    describe('MOVE_CARD', () => {
      let a, b, c, state

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
        const cardId = b.id
        const targetId = c.id

        mutations.MOVE_CARD(state, { cardId, targetId })

        expect(a.child).toBeNull()
      })

      it('should set the child of the target to the moving card', () => {
        const cardId = b.id
        const targetId = c.id

        mutations.MOVE_CARD(state, { cardId, targetId })

        expect(c.child).toEqual(b)
      })

      it('should not mutate the state if the moving card is the same as its parent', () => {
        const cardId = c.id
        const targetId = a.id

        mutations.MOVE_CARD(state, { cardId, targetId })

        expect(state[a.id]).toEqual(a)
        expect(state[b.id]).toEqual(b)
        expect(state[c.id]).toEqual(c)
      })

      it('should not remove the child card from its parent if it is an orphan', () => {
        const originalState = { ...state }
        const cardId = b.id
        const targetId = b.id

        mutations.MOVE_CARD(state, { cardId, targetId })

        expect(state).toEqual(originalState)
      })
    })
  })
})
