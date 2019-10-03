import root from './root'
import Card from '../models/Card'
import deck from './deck'

const {
  getters,
  actions,
  mutations
} = root

describe('Vuex root module', () => {
  describe('getters', () => {
    describe('hint()', () => {
      it('should return the (index)th element in the entries', () => {
        const state = {
          hints: {
            entries: [[1, 2]],
            index: 0
          }
        }
        expect(getters.hint(state)).toEqual(state.hints.entries[0])
      })

      it('should an empty array if the entry is not available', () => {
        const state = {
          hints: {
            entries: [],
            index: 0
          }
        }
        expect(getters.hint(state)).toEqual([])
      })
    })
  })

  describe('actions', () => {
    const commit = jest.fn()

    describe('newGame()', () => {
      const card = new Card()
      const cards = {
        [card.id]: card
      }
      const state = {
        deck: { cards }
      }

      beforeEach(() => {
        actions.newGame({ commit, state })
      })

      it('should clear the existing game', () => {
        expect(commit).toHaveBeenCalledWith('CLEAR_EXISTING_GAME')
      })

      it('should initialize a deck of cards', () => {
        expect(commit).toHaveBeenCalledWith('INIT_DECK')
      })

      it('should register the deck of cards', () => {
        expect(commit).toHaveBeenCalledWith('REGISTER_CARDS', cards)
      })

      it('should initialize the tableau with the deck of cards', () => {
        expect(commit).toHaveBeenCalledWith('INIT_TABLEAU', cards)
      })

      it('should initialize the foundation spaces', () => {
        expect(commit).toHaveBeenCalledWith('INIT_FOUNDATIONS')
      })

      it('should reveal the topmost cards of the tableau', () => {
        expect(commit).toHaveBeenCalledWith('REVEAL_CARDS')
      })
    })
  })

  describe('mutations', () => {
    describe('CLEAR_EXISTING_GAME', () => {
      const card = new Card()
      const state = {}

      beforeEach(() => {
        state.cards = {
          [card.id]: card
        }
        state.deck = {
          cards: [card]
        }
        state.gameId = 'original-game-id'
      })

      it('should clear the cards', () => {
        mutations['CLEAR_EXISTING_GAME'](state)

        expect(state.cards).toEqual({})
      })

      it('should reset the deck store module to its original state', () => {
        mutations['CLEAR_EXISTING_GAME'](state)

        expect(state.deck).toEqual(deck.createState())
      })

      it('should set a new game id', () => {
        mutations['CLEAR_EXISTING_GAME'](state)

        expect(state.gameId).not.toEqual('original-game-id')
        expect(typeof state.gameId).toBe('string')
      })
    })

    describe('CLEAR_HINTS', () => {
      it('should clear the current hint entries and index', () => {
        const state = {
          hints: {
            entries: [[1, 2], [3, 4]],
            index: 1
          }
        }

        mutations['CLEAR_HINTS'](state)

        expect(state.hints.entries).toHaveLength(0)
        expect(state.hints.index).toEqual(-1)
      })
    })

    describe('REVEAL_CARDS', () => {
      it('should set all childless cards in the state to be revealed', () => {
        const a = new Card()
        const b = new Card()
        const c = new Card()
        const state = {
          cards: {
            [a.id]: a,
            [b.id]: b
          }
        }

        b.child = c

        mutations['REVEAL_CARDS'](state)

        expect(a.revealed).toEqual(true)
        expect(b.revealed).toEqual(false)
        expect(a.revealed).toEqual(true)
      })
    })
  })
})
