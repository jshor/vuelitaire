import { Suits } from '../../../constants'
import Card from '../../../models/Card'
import Pair from '../../../models/Pair'
import deck, { DeckState } from '../deck'
import { HintsState } from '../hints'
import root, { RootState } from '../root'

const {
  getters,
  actions,
  mutations
} = root

describe('Root Vuex module', () => {
  afterEach(() => jest.resetAllMocks())

  describe('getters', () => {
    describe('highlightedCards()', () => {
      describe('when no card is selected', () => {
        it('should return the selected card id as the only highlighted card', () => {
          const selectedCard: Card = new Card(Suits.DIAMONDS, 1)
          const state: RootState = new RootState()

          state.hints = new HintsState()
          state.selectedCard = selectedCard

          expect(getters.highlightedCards(state)).toEqual([selectedCard.id])
        })

        it('should return the (index)th element in the entries', () => {
          const state: RootState = new RootState()

          state.hints = new HintsState()
          state.hints.entries = [['card-1', 'card-2']]
          state.hints.index = 0

          expect(getters.highlightedCards(state)).toEqual(state.hints.entries[0])
        })

        it('should an empty array if the entry is not available', () => {
          const state: RootState = new RootState()

          state.hints = new HintsState()

          expect(getters.highlightedCards(state)).toEqual([])
        })
      })
    })
  })

  describe('actions', () => {
    const commit = jest.fn()
    const dispatch = jest.fn()

    describe('newGame()', () => {
      describe('before the animation completes', () => {
        beforeEach(() => {
          actions.newGame({ commit })
        })

        it('should toggle on the animation flag', () => {
          expect(commit).toHaveBeenCalledWith('animation/SET_IN_PROGRESS', true)
        })

        it('should clear the existing game', () => {
          expect(commit).toHaveBeenCalledWith('CLEAR_GAME')
        })

        it('should initialize a deck of cards', () => {
          expect(commit).toHaveBeenCalledWith('deck/INIT_DECK')
        })

        it('should initialize the tableau with the deck of cards', () => {
          expect(commit).toHaveBeenCalledWith('deck/INIT_TABLEAU')
        })

        it('should initialize the foundation spaces', () => {
          expect(commit).toHaveBeenCalledWith('deck/cards/INIT_FOUNDATIONS')
        })
      })

      describe('after animation completed', () => {
        it('should complete the animation', (done) => {
          jest.useFakeTimers()

          actions
            .newGame({ commit })
            .then(() => {
              expect(commit).toHaveBeenCalledWith('deck/cards/CLEAR_ANIMATION_INDICES')
              expect(commit).toHaveBeenCalledWith('deck/cards/REVEAL_CARDS')
              expect(commit).toHaveBeenCalledWith('animation/SET_IN_PROGRESS', false)
              done()
            })
          jest.runAllTimers()
        })
      })
    })

    describe('deal()', () => {
      beforeEach(() => {
        actions.deal({ commit })
      })

      it('should clear the dangling state and deal a new set of cards', () => {
        expect(commit).toHaveBeenCalledWith('deck/SET_MOVE', null)
      })

      it('should record a revertible game state', () => {
        expect(commit).toHaveBeenCalledWith('RECORD_REVERTIBLE_STATE')
      })

      it('should deal', () => {
        expect(commit).toHaveBeenCalledWith('deck/DEAL')
      })

      it('should clear the existing hints', () => {
        expect(commit).toHaveBeenCalledWith('hints/CLEAR_HINTS')
      })
    })

    describe('setSelection()', () => {
      describe('when a card is already selected', () => {
        it('should change the selection to the target if it cannot accept the previously-selected card', async () => {
          const aceOfSpades: Card = new Card(Suits.SPADES, 0)
          const threeOfHearts: Card = new Card(Suits.HEARTS, 0)
          const state = {
            selectedCard: aceOfSpades
          }

          threeOfHearts.isPlayed = threeOfHearts.revealed = true

          await actions.setSelection({ commit, dispatch, state }, threeOfHearts)

          expect(commit).toHaveBeenCalledTimes(1)
          expect(commit).toHaveBeenCalledWith('SELECT_CARD', threeOfHearts)
        })

        it('should place the previously-selected card onto the given target', async () => {
          const aceOfSpades: Card = new Card(Suits.SPADES, 0)
          const twoOfHearts: Card = new Card(Suits.HEARTS, 0)
          const state = {
            selectedCard: aceOfSpades
          }
          twoOfHearts.canAcceptCard = jest.fn(() => true)

          await actions.setSelection({ commit, dispatch, state }, twoOfHearts)

          const payload: Pair = new Pair(aceOfSpades.id, twoOfHearts.id)

          expect(commit).toHaveBeenCalledTimes(1)
          expect(commit).toHaveBeenCalledWith('SELECT_CARD', null)
          expect(dispatch).toHaveBeenCalledTimes(2)
          expect(dispatch).toHaveBeenCalledWith('animation/move', expect.objectContaining(payload))
          expect(dispatch).toHaveBeenCalledWith('moveCard', expect.objectContaining(payload))
        })
      })

      describe('when a card is not selected', () => {
        it('should only select the given target card', async () => {
          const card: Card = new Card(Suits.DIAMONDS, 1)
          const state: RootState = new RootState()

          await actions.setSelection({ commit, dispatch, state }, card)

          expect(commit).toHaveBeenCalledTimes(1)
          expect(commit).toHaveBeenCalledWith('SELECT_CARD', card)
        })
      })
    })
  })

  describe('CLEAR_GAME', () => {
    const card: Card = new Card(Suits.DIAMONDS, 1)
    const state: RootState = new RootState()

    beforeEach(() => {
      state.deck = new DeckState()
      state.deck.cards = {
        [card.id]: card
      }
      state.deck.stock = [card]
      state.gameId = 'original-game-id'
    })

    it('should reset the deck store module to its original state', () => {
      mutations.CLEAR_GAME(state)

      expect(state.deck).toEqual({
        ...deck.createState(),
        cards: {}
      })
    })

    it('should set a new game id', () => {
      mutations.CLEAR_GAME(state)

      expect(state.gameId).not.toEqual('original-game-id')
      expect(typeof state.gameId).toBe('string')
    })
  })
})
