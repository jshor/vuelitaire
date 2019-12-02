import { Suits } from '@/constants'
import auto from '@/gameplay/auto'
import IDeckState from '@/interfaces/IDeckState'
import IRootState from '@/interfaces/IRootState'
import Card from '@/models/Card'
import Pair from '@/models/Pair'
import deck from '../deck'
import root from '../root'
import invokeAction from './__helpers__/invokeAction'

const {
  getters,
  actions,
  mutations
} = root

const createState = (): IRootState => ({
  ...root.state,
  deck: { ...deck.state },
  hints: { ...deck.state }
} as IRootState)

describe('Root Vuex module', () => {
  afterEach(() => jest.resetAllMocks())

  describe('getters', () => {
    describe('highlightedCards()', () => {
      describe('when no card is selected', () => {
        it('should return the selected card id as the only highlighted card', () => {
          const selectedCard: Card = new Card(Suits.DIAMONDS, 1)
          const state: IRootState = createState()

          state.selectedCard = selectedCard

          expect(getters.highlightedCards(state, null, null, null)).toEqual([selectedCard.id])
        })

        it('should return the (index)th element in the entries', () => {
          const state: IRootState = createState()

          state.hints.entries = [['card-1', 'card-2']]
          state.hints.index = 0

          expect(getters.highlightedCards(state, null, null, null)).toEqual(state.hints.entries[0])
        })

        it('should an empty array if the entry is not available', () => {
          const state: IRootState = createState()

          state.hints.entries = []

          expect(getters.highlightedCards(state, null, null, null)).toEqual([])
        })
      })
    })

    describe('canUndo()', () => {
      it('should return true if there exists states to revert to', () => {
        const state: IRootState = createState()

        state.revertibleStates = [{ ...state.deck }]

        expect(getters.canUndo(state, null, null, null)).toEqual(true)
      })

      it('should return false if there are no states to revert to', () => {
        const state: IRootState = createState()

        state.revertibleStates = []

        expect(getters.canUndo(state, null, null, null)).toEqual(false)
      })
    })
  })

  describe('actions', () => {
    const commit = jest.fn()
    const dispatch = jest.fn()

    describe('newGame()', () => {
      describe('before the animation completes', () => {
        beforeEach(() => {
          invokeAction(actions, 'newGame', { commit })
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

          invokeAction(actions, 'newGame', { commit })
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
        invokeAction(actions, 'deal', { commit, dispatch })
      })

      it('should clear the existing selected cards', () => {
        expect(dispatch).toHaveBeenCalledWith('clearSelection')
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

      it('should halt UI until the deal animation completes', () => {
        expect(dispatch).toHaveBeenLastCalledWith('animation/wait')
      })
    })

    describe('moveCard()', () => {
      const pair: Pair = new Pair('card-id', 'target-id')

      beforeEach(() => {
        invokeAction(actions, 'moveCard', { commit, dispatch }, pair)
      })

      it('should clear the existing selected cards', () => {
        expect(dispatch).toHaveBeenCalledTimes(1)
        expect(dispatch).toHaveBeenCalledWith('clearSelection')
      })

      it('should move the card', () => {
        expect(commit).toHaveBeenCalledWith('deck/SET_MOVE', pair)
        expect(commit).toHaveBeenCalledWith('deck/cards/MOVE_CARD', pair)
        expect(commit).toHaveBeenCalledWith('deck/REMOVE_FROM_DECK', pair.cardId)
      })

      it('should record the deck state', () => {
        expect(commit).toHaveBeenCalledWith('RECORD_REVERTIBLE_STATE')
      })
    })

    describe('undo()', () => {
      const parentId: string = 'old-parent-id'
      const targetId: string = 'old-target-id'
      const cardId: string = 'old-card-id'
      let state: IRootState

      beforeEach(() => {
        state = createState()
      })

      describe('when there is no previous state to revert to', () => {
        it('should revert to the previous state and clear hints', async () => {
          await invokeAction(actions, 'undo', { commit, dispatch, state })

          expect(commit).toHaveBeenCalledTimes(2)
          expect(commit).toHaveBeenCalledWith('REVERT_TO_PREV_STATE')
          expect(commit).toHaveBeenCalledWith('hints/CLEAR_HINTS')
        })
      })

      describe('when the previous state does not have a move to reverse', () => {
        it('should revert to the previous state and clear hints', async () => {
          state.revertibleStates.push({ ...deck.state } as IDeckState)
          state.revertibleStates[0].move = null

          await invokeAction(actions, 'undo', { commit, dispatch, state })

          expect(commit).toHaveBeenCalledTimes(2)
          expect(commit).toHaveBeenCalledWith('REVERT_TO_PREV_STATE')
          expect(commit).toHaveBeenCalledWith('hints/CLEAR_HINTS')
        })
      })

      describe('when a move was made in the previous state', () => {
        let prevState: IDeckState

        beforeEach(async () => {
          prevState = ({ ...deck.state } as IDeckState)
          prevState.move = new Pair(cardId, targetId)
          prevState.move.parentId = parentId
          state.revertibleStates.push(prevState)

          await invokeAction(actions, 'undo', { commit, dispatch, state })
        })

        it('should dispatch the animation/reverse action', () => {
          expect(dispatch).toHaveBeenCalledTimes(1)
          expect(dispatch).toHaveBeenCalledWith('animation/reverse', prevState.move)
        })

        it('should unreveal the old parent card, revert to the previous state and clear hints', () => {
          expect(commit).toHaveBeenCalledTimes(3)
          expect(commit).toHaveBeenCalledWith('deck/cards/UNREVEAL_CARD', parentId)
          expect(commit).toHaveBeenCalledWith('REVERT_TO_PREV_STATE')
          expect(commit).toHaveBeenCalledWith('hints/CLEAR_HINTS')
        })
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

          threeOfHearts.revealed = true

          await invokeAction(actions, 'setSelection', { commit, dispatch, state }, threeOfHearts)

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

          await invokeAction(actions, 'setSelection', { commit, dispatch, state }, twoOfHearts)

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
          const state: IRootState = createState()

          await invokeAction(actions, 'setSelection', { commit, dispatch, state }, card)

          expect(commit).toHaveBeenCalledTimes(1)
          expect(commit).toHaveBeenCalledWith('SELECT_CARD', card)
        })
      })
    })

    describe('clearSelection()', () => {
      it('should reset the selected card and clear hints', () => {
        invokeAction(actions, 'clearSelection', { commit })

        expect(commit).toHaveBeenCalledTimes(2)
        expect(commit).toHaveBeenCalledWith('SELECT_CARD', null)
        expect(commit).toHaveBeenCalledWith('hints/CLEAR_HINTS')
      })
    })

    describe('autoplayCard()', () => {
      const card: Card = new Card(Suits.DIAMONDS, 1)
      const state: IDeckState = createState().deck

      it('should move the card if a pair is found', async () => {
        const pair: Pair = new Pair(card.id, 'some-target-id')

        jest
          .spyOn(auto, 'findNextMove')
          .mockReturnValue(pair)

        await invokeAction(actions, 'autoplayCard', { state, commit, dispatch }, card)

        expect(dispatch).toHaveBeenCalledTimes(2)
        expect(dispatch).toHaveBeenCalledWith('animation/move', pair)
        expect(dispatch).toHaveBeenLastCalledWith('moveCard', pair)
      })

      it('should animate an error on the card if there is no applicable pair', async () => {
        jest
          .spyOn(auto, 'findNextMove')
          .mockReturnValue(null)

        await invokeAction(actions, 'autoplayCard', { state, commit, dispatch }, card)

        expect(dispatch).toHaveBeenCalledTimes(1)
        expect(dispatch).toHaveBeenCalledWith('animation/wait')
        expect(commit).toHaveBeenCalledTimes(2)
        expect(commit).toHaveBeenCalledWith('deck/cards/SET_CARD_ERROR', { cardId: card.id, hasError: true })
        expect(commit).toHaveBeenLastCalledWith('deck/cards/SET_CARD_ERROR', { cardId: card.id, hasError: false })
      })
    })

    describe('autoComplete()', () => {
      const state: IDeckState = createState().deck

      it('should move the card and then temporarily halt UI if a pair is found before re-attempt', async () => {
        const pair: Pair = new Pair('some-card-id', 'some-target-id')

        jest
          .spyOn(auto, 'findNextPromotion')
          .mockReturnValue(pair)

        await invokeAction(actions, 'autoComplete', { state, dispatch })

        expect(dispatch).toHaveBeenCalledTimes(4)
        expect(dispatch).toHaveBeenCalledWith('animation/move', pair)
        expect(dispatch).toHaveBeenCalledWith('moveCard', pair)
        expect(dispatch).toHaveBeenCalledWith('animation/wait')
        expect(dispatch).toHaveBeenCalledWith('autoComplete')
      })

      it('should trigger a deal if no pair is found before re-attempt', async () => {
        jest
          .spyOn(auto, 'findNextPromotion')
          .mockReturnValue(null)

        await invokeAction(actions, 'autoComplete', { state, dispatch })

        expect(dispatch).toHaveBeenCalledTimes(2)
        expect(dispatch).toHaveBeenCalledWith('deal')
        expect(dispatch).toHaveBeenCalledWith('autoComplete')
      })
    })
  })

  describe('SELECT_CARD', () => {
    it('should set `selectedCard` to the given card', () => {
      const state: IRootState = createState()
      const card: Card = new Card(Suits.DIAMONDS, 3)

      mutations.SELECT_CARD(state, card)

      expect(state.selectedCard).toEqual(card)
    })
  })

  describe('CLEAR_GAME', () => {
    const card: Card = new Card(Suits.DIAMONDS, 1)
    const state: IRootState = createState()

    beforeEach(() => {
      state.deck.cards = {
        foundations: {},
        tableau: {},
        regular: {
          [card.id]: card
        }
      }
      state.deck.stock = [card]
      state.gameId = 'original-game-id'
    })

    it('should reset the deck store module to its original state', () => {
      mutations.CLEAR_GAME(state)

      expect(state.deck).toEqual({
        ...createState().deck,
        cards: {
          foundations: {},
          tableau: {},
          regular: {}
        }
      })
    })

    it('should set a new game id', () => {
      mutations.CLEAR_GAME(state)

      expect(state.gameId).not.toEqual('original-game-id')
      expect(typeof state.gameId).toBe('string')
    })
  })

  describe('RECORD_REVERTIBLE_STATE', () => {
    it('should push a cloned copy of the deck state into the list', () => {
      const state: IRootState = createState()
      const deckState: IDeckState = { ...deck.state } as IDeckState

      deckState.stock = [new Card(Suits.CLUBS, 0)]
      state.revertibleStates = []
      state.deck = deckState

      mutations.RECORD_REVERTIBLE_STATE(state)

      expect(state.revertibleStates).toHaveLength(1)
      expect(state.revertibleStates).toEqual(
        expect.arrayContaining([
          expect.objectContaining(deckState)
        ])
      )
    })
  })

  describe('REVERT_TO_PREV_STATE', () => {
    it('should push a cloned copy of the deck state into the list', () => {
      const state: IRootState = createState()
      const deckState: IDeckState = { ...deck.state } as IDeckState

      deckState.stock = [new Card(Suits.CLUBS, 0)]
      state.revertibleStates = [deckState]

      mutations.REVERT_TO_PREV_STATE(state)

      expect(state.deck).toEqual(expect.objectContaining(deckState))
    })
  })
})
