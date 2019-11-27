import { Suits } from '../../../constants'
import Card from '../../../models/Card'
import Pair from '../../../models/Pair'
import deck from '../deck'
import root from '../root'
import invokeAction from './__helpers__/invokeAction'
import IRootState from '../../../interfaces/IRootState'
import IDeckState from '../../../interfaces/IDeckState'

const {
  getters,
  actions,
  mutations
} = root

const createState = (): IRootState => (<IRootState>{
  ...root.state,
  deck: { ...deck.state },
  hints: { ...deck.state }
})

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
        invokeAction(actions, 'deal', { commit })
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

    describe('moveCard()', () => {
      const pair: Pair = new Pair('card-id', 'target-id')

      beforeEach(() => {
        invokeAction(actions, 'moveCard', { commit }, pair)
      })

      it('should move the card', () => {
        expect(commit).toHaveBeenCalledWith('deck/SET_MOVE', pair)
        expect(commit).toHaveBeenCalledWith('deck/cards/MOVE_CARD', pair)
        expect(commit).toHaveBeenCalledWith('deck/REMOVE_FROM_DECK', pair.cardId)
      })

      it('should record the deck state', () => {
        expect(commit).toHaveBeenCalledWith('RECORD_REVERTIBLE_STATE')
      })

      it('should clear any active hints', () => {
        expect(commit).toHaveBeenCalledWith('hints/CLEAR_HINTS')
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
          state.revertibleStates.push(<IDeckState>{ ...deck.state })
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
          prevState = <IDeckState>{ ...deck.state }
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

          threeOfHearts.isPlayed = threeOfHearts.revealed = true

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
      it('should reset the selected card', () => {
        invokeAction(actions, 'clearSelection', { commit })

        expect(commit).toHaveBeenCalledTimes(1)
        expect(commit).toHaveBeenCalledWith('SELECT_CARD', null)
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
        [card.id]: card
      }
      state.deck.stock = [card]
      state.gameId = 'original-game-id'
    })

    it('should reset the deck store module to its original state', () => {
      mutations.CLEAR_GAME(state)

      expect(state.deck).toEqual({
        ...createState().deck,
        cards: {}
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
      const deckState: IDeckState = <IDeckState>{ ...deck.state }

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
      const deckState: IDeckState = <IDeckState>{ ...deck.state }

      deckState.stock = [new Card(Suits.CLUBS, 0)]
      state.revertibleStates = [deckState]

      mutations.REVERT_TO_PREV_STATE(state)

      expect(state.deck).toEqual(expect.objectContaining(deckState))
    })
  })
})
