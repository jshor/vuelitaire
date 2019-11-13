import { values } from 'lodash'
import deck, { DeckState } from '..'
import { Suits } from '../../../../constants'
import getLineage from '../../../../utils/getLineage'
import BaseModel from '../../../models/BaseModel'
import Card from '../../../models/Card'
import LaneSpace from '../../../models/LaneSpace'
import Pair from '../../../models/Pair'

const {
  state,
  getters,
  mutations
} = deck

describe('Vuex Deck module', () => {
  describe('getters', () => {
    describe('canDeal', () => {
      it('should return true if there are cards in the state to deal', () => {
        const state: DeckState = new DeckState()

        state.stock = [new Card()]

        expect(getters.canDeal(state)).toEqual(true)
      })

      it('should return true if there no more cards left to deal', () => {
        const state: DeckState = new DeckState()

        state.stock = []

        expect(getters.canDeal(state)).toEqual(false)
      })
    })
  })

  describe('mutations', () => {
    describe('INIT_DECK', () => {
      it('should create a 52 deck of cards with 4 suits', () => {
        const state: DeckState = deck.createState()

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
      let state: DeckState

      beforeEach(() => {
        state = deck.createState()
        mutations.INIT_DECK(state)
      })

      it('should apply 7 space cards to the state', () => {
        mutations.INIT_TABLEAU(state)

        const spaces = values(state.cards).filter((t: BaseModel) => t.type === 'LaneSpace')

        expect(spaces).toHaveLength(7)
      })

      it('should create a hierarchy of (n + 2) cards for each nth index, for n = 7 ~ 1', () => {
        mutations.INIT_TABLEAU(state)

        expect.assertions(7)
        values(state.cards)
          .filter((t: BaseModel) => t.type === 'LaneSpace')
          .reverse()
          .forEach((space: LaneSpace, index: number) => {
            expect(getLineage(space)).toHaveLength(index + 2)
          })
      })
    })

    describe('DEAL', () => {
      let state: DeckState

      beforeEach(() => {
        state = deck.createState()
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
        expect(state.waste).toHaveLength(state.dealCount)
      })

      it('should deal one card if only one remains in the stock pile', () => {
        state.stock = state.stock.slice(0, 3)
        state.waste = []

        mutations.DEAL(state)

        expect(state.dealt).toHaveLength(1)
        expect(state.waste).toHaveLength(1)
      })

      describe('when there are no more cards left to deal', () => {
        let waste: BaseModel[]

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
      xit('should remove the given card from the waste pile if it exists', () => {
        const card: BaseModel = new Card()
        const state: DeckState = deck.createState()

        state.waste = [card]
        state.dealt = [card]

        mutations.REMOVE_FROM_DECK(state, card.id)

        expect(state.waste).not.toContain(card)
        expect(state.dealt).not.toContain([card])
      })

      it('should not mutate the state if the card having the given id doesn\'t exist', () => {
        const card: BaseModel = new Card()
        const state: DeckState = deck.createState()

        state.waste = [card]
        state.dealt = [card]

        mutations.REMOVE_FROM_DECK(state, '????')

        expect(state.waste).toEqual([card])
        expect(state.dealt).toEqual([card])
      })
    })

    describe('SET_MOVE', () => {
      const parentCard: BaseModel = new Card()
      const movingCard: BaseModel = new Card()
      const targetCard: BaseModel = new Card()
      const move: Pair = new Pair(movingCard.id, targetCard.id)
      let state: DeckState

      beforeEach(() => {
        state = deck.createState()

        state.cards[parentCard.id] = movingCard
        state.cards[movingCard.id] = movingCard
        state.cards[targetCard.id] = targetCard
      })

      describe('when the move is set', () => {
        xit('should set the parent id when one exists', () => {
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
        state.move = null
        mutations.SET_MOVE(state)

        expect(state.move).toBeNull()
      })
    })
  })
})
