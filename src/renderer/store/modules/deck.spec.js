import deck from './deck'
import Card from '../models/Card'
import { Suits } from '../../constants'

const {
  state: originalState,
  getters,
  actions,
  mutations
} = deck

describe('Vuex deck module', () => {
  afterEach(() => jest.resetAllMocks())

  describe('actions', () => {
    const commit = jest.fn()

    describe('deal()', () => {
      it('should commit the DEAL and CLEAR_HINTS mutations', () => {
        actions.deal({ commit })

        expect(commit).toHaveBeenCalledTimes(2)
        expect(commit).toHaveBeenCalledWith('DEAL')
        expect(commit).toHaveBeenCalledWith('CLEAR_HINTS')
      })
    })
  })

  describe('getters', () => {
    describe('canDeal', () => {
      it('should return true if there are cards in the state to deal', () => {
        const state = {
          cards: [new Card()]
        }

        expect(getters.canDeal(state)).toEqual(true)
      })

      it('should return true if there no more cards left to deal', () => {
        const state = {
          cards: []
        }

        expect(getters.canDeal(state)).toEqual(false)
      })
    })
  })

  describe('mutations', () => {
    describe('INIT_DECK', () => {
      it('should create a 52 deck of cards with 4 suits', () => {
        const state = { cards: [] }
        const suitOfType = type => state
          .cards
          .filter(({ suit }) => suit === type)

        mutations.INIT_DECK(state)

        expect(suitOfType(Suits.SPADES)).toHaveLength(13)
        expect(suitOfType(Suits.HEARTS)).toHaveLength(13)
        expect(suitOfType(Suits.DIAMONDS)).toHaveLength(13)
        expect(suitOfType(Suits.CLUBS)).toHaveLength(13)
      })
    })

    describe('DEAL', () => {
      let state

      beforeEach(() => {
        state = { ...originalState }
        mutations.INIT_DECK(state)
      })

      it('should set both the waste and dealt piles to contain `dealCount` cards after dealing once', () => {
        mutations.DEAL(state)

        expect(state.dealt).toHaveLength(state.dealCount)
        expect(state.waste).toHaveLength(state.dealCount)
      })

      it('should append `dealtCount` cards to the waste pile after dealing again', () => {
        mutations.DEAL(state)

        expect(state.dealt).toHaveLength(state.dealCount)
        expect(state.waste).toHaveLength(state.dealCount * 2)
      })

      it('should deal two cards if only two remain in the cards state', () => {
        state.cards = state.cards.slice(0, 2)
        state.waste = []

        mutations.DEAL(state)

        expect(state.dealt).toHaveLength(2)
        expect(state.waste).toHaveLength(2)
      })

      describe('when there are no more cards left to deal', () => {
        let waste

        beforeEach(() => {
          waste = state.cards
          state.waste = waste
          state.cards = []
        })

        it('should reuse the reversed waste pile as the cards stock pile', () => {
          mutations.DEAL(state)

          expect(state.cards).toEqual(waste.reverse())
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
        const card = new Card()
        const state = {
          waste: [card]
        }

        mutations.REMOVE_FROM_DECK(state, card.id)

        expect(state.waste).not.toContain(card)
      })

      it('should not mutate the state if the card having the given id doesn\'t exist', () => {
        const card = new Card()
        const state = {
          waste: [card]
        }

        mutations.REMOVE_FROM_DECK(state, '????')

        expect(state.waste).toEqual([card])
      })
    })
  })
})
