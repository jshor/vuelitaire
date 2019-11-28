import values from 'lodash-es/values'
import deck from '..'
import { Suits } from '../../../../constants'
import getLineage from '../../../../utils/getLineage'
import ICard from '../../../../interfaces/ICard'
import Card from '../../../../models/Card'
import LaneSpace from '../../../../models/LaneSpace'
import Pair from '../../../../models/Pair'
import IDeckState from '../../../../interfaces/IDeckState'

const {
  getters,
  mutations
} = deck

const createState = (): IDeckState => (<IDeckState>{ ...deck.state })

export default createState


describe('Vuex Deck module', () => {
  describe('getters', () => {
    describe('canDeal', () => {
      it('should return true if there are cards in the state to deal', () => {
        const state: IDeckState = createState()

        state.stock = [new Card(Suits.DIAMONDS, 1)]

        expect(getters.canDeal(state, null, null, null)).toEqual(true)
      })

      it('should return true if there no more cards left to deal', () => {
        const state: IDeckState = createState()

        state.stock = []

        expect(getters.canDeal(state, null, null, null)).toEqual(false)
      })
    })
  })

  describe('mutations', () => {
    describe('INIT_DECK', () => {
      it('should create a 52 deck of cards with 4 suits', () => {
        const state: IDeckState = createState()

        const suitOfType = (type) => state
          .stock
          .filter(({ suit }: Card) => suit === type)

        mutations.INIT_DECK(state)

        expect(suitOfType(Suits.SPADES)).toHaveLength(13)
        expect(suitOfType(Suits.HEARTS)).toHaveLength(13)
        expect(suitOfType(Suits.DIAMONDS)).toHaveLength(13)
        expect(suitOfType(Suits.CLUBS)).toHaveLength(13)
      })
    })

    describe('INIT_TABLEAU', () => {
      let state: IDeckState

      beforeEach(() => {
        state = createState()
        state.cards = {}

        mutations.INIT_DECK(state)
      })

      it('should apply 7 space cards to the state', () => {
        mutations.INIT_TABLEAU(state)

        const spaces = values(state.cards).filter((t: ICard) => t instanceof LaneSpace)

        expect(spaces).toHaveLength(7)
      })

      it('should create a hierarchy of (n + 2) cards for each nth index, for n = 7 ~ 1', () => {
        mutations.INIT_TABLEAU(state)
        const arr = []

        expect.assertions(7)
        values(state.cards)
          .filter((t: ICard) => t instanceof LaneSpace)
          .reverse()
          .forEach((space: LaneSpace, index: number) => {
            expect(getLineage(space)).toHaveLength(index + 2) // + 2 cards (one for LaneSpace, one for last child)
          })
      })
    })

    describe('DEAL', () => {
      let state: IDeckState

      beforeEach(() => {
        state = createState()
        mutations.INIT_DECK(state)
      })

      it('should set both the waste and dealt piles to contain `dealCount` cards after dealing once', () => {
        mutations.DEAL(state)

        expect(state.dealt).toHaveLength(state.dealCount)
        expect(state.waste).toHaveLength(state.dealCount)
      })

      it('should append `dealCount` cards to the waste pile after dealing again', () => {
        mutations.DEAL(state)

        expect(state.dealt).toHaveLength(state.dealCount)
        expect(state.waste).toHaveLength(state.dealCount * 2)
      })

      it('should deal one card if only one remains in the stock pile', () => {
        state.stock = state.stock.slice(0, 3)
        state.waste = []

        mutations.DEAL(state)

        expect(state.dealt).toHaveLength(1)
        expect(state.waste).toHaveLength(1)
      })

      describe('when there are no more cards left to deal', () => {
        let waste: ICard[]

        beforeEach(() => {
          waste = state.stock
          state.waste = waste
          state.stock = []
        })

        it('should reuse the reversed waste pile as the cards stock pile', () => {
          mutations.DEAL(state)

          expect(state.stock).toEqual(waste.reverse())
        })

        it('should clear the waste and dealt piles', () => {
          mutations.DEAL(state)

          expect(state.waste).toHaveLength(0)
          expect(state.dealt).toHaveLength(0)
        })
      })
    })

    describe('REMOVE_FROM_DECK', () => {
      it('should remove the given card from the waste pile if it exists', () => {
        const card: ICard = new Card(Suits.DIAMONDS, 1)
        const state: IDeckState = createState()

        state.waste = [card]
        state.dealt = [card]

        mutations.REMOVE_FROM_DECK(state, card.id)

        expect(state.waste).not.toContain(card)
        expect(state.dealt).not.toContain([card])
      })

      it('should not mutate the state if the card having the given id doesn\'t exist', () => {
        const card: ICard = new Card(Suits.DIAMONDS, 1)
        const state: IDeckState = createState()

        state.waste = [card]
        state.dealt = [card]

        mutations.REMOVE_FROM_DECK(state, '????')

        expect(state.waste).toEqual([card])
        expect(state.dealt).toEqual([card])
      })
    })

    describe('SET_MOVE', () => {
      const parentCard: ICard = new Card(Suits.DIAMONDS, 1)
      const movingCard: ICard = new Card(Suits.DIAMONDS, 1)
      const targetCard: ICard = new Card(Suits.DIAMONDS, 1)
      const move: Pair = new Pair(movingCard.id, targetCard.id)
      let state: IDeckState

      beforeEach(() => {
        state = createState()

        state.cards[parentCard.id] = parentCard
        state.cards[movingCard.id] = movingCard
        state.cards[targetCard.id] = targetCard
      })

      describe('when the move is set', () => {
        it('should set the parent id when one exists', () => {
          parentCard.child = movingCard
          mutations.SET_MOVE(state, move)

          expect(state.move).toEqual(move)
          expect(state.move.parentId).toEqual(parentCard.id)
        })

        it('should set the parent id to `DEAL_CARD`', () => {
          parentCard.child = null
          mutations.SET_MOVE(state, move)

          expect(state.move).toEqual(move)
          expect(state.move.parentId).toEqual('DEAL_CARD')
        })
      })
    })

    describe('when the move is set', () => {
      it('should not mutate `move`', () => {
        const state: IDeckState = createState()

        state.move = null
        mutations.SET_MOVE(state)

        expect(state.move).toBeNull()
      })
    })
  })
})
