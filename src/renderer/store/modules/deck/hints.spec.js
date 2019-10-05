import hints from './hints'

const {
  actions,
  mutations
} = hints

jest.mock('../../../gameplay', () => ({
  getMoveableCardHints: () => [],
  getLaneCreationHints: () => [],
  getDestructuringLaneHints: () => [],
  getDeckHints: () => [],
  getWorryBackHints: () => []
}))

describe('Vuex hints module', () => {
  describe('actions', () => {
    const dispatch = jest.fn()
    const commit = jest.fn()

    afterEach(() => jest.resetAllMocks())

    describe('showHint()', () => {
      it('should generate new hints when no hints have been generated yet', () => {
        const state = { entries: [] }

        actions.showHint({ commit, dispatch, state })

        expect(dispatch).toHaveBeenCalledTimes(1)
        expect(dispatch).toHaveBeenCalledWith('generateHints')
        expect(commit).toHaveBeenCalledTimes(1)
        expect(commit).toHaveBeenCalledWith('SHOW_NEXT_HINT')
      })

      it('should not generate new hints when hints already exist in the state', () => {
        const state = { entries: ['DEAL_CARD'] }

        actions.showHint({ commit, dispatch, state })

        expect(dispatch).not.toHaveBeenCalled()
        expect(commit).toHaveBeenCalledTimes(1)
        expect(commit).toHaveBeenCalledWith('SHOW_NEXT_HINT')
      })
    })

    describe('generateHints()', () => {
      it('should generate a list of hints and add them to the entries, including the default one', () => {
        const rootState = {
          game: {
            cards: {},
            deck: {
              waste: []
            }
          }
        }
        actions.generateHints({ rootState, commit })

        expect(commit).toHaveBeenCalledTimes(1)
        expect(commit).toHaveBeenCalledWith('SET_HINTS', expect.any(Array))
      })
    })
  })

  describe('mutations', () => {
    describe('CLEAR_HINTS', () => {
      it('should clear the current hint entries and index', () => {
        const state = {
          entries: [[1, 2], [3, 4]],
          index: 1
        }

        mutations['CLEAR_HINTS'](state)

        expect(state.entries).toHaveLength(0)
        expect(state.index).toEqual(-1)
      })
    })

    describe('SET_HINTS', () => {
      it('should apply the given hints to the state entries', () => {
        const hints = [[1, 2], [3, 4]]
        const state = { entries: [] }

        mutations['SET_HINTS'](state, hints)

        expect(state.entries).toEqual(hints)
      })
    })

    describe('SHOW_NEXT_HINT', () => {
      it('should increment the index', () => {
        const state = {
          entries: [[1, 2], [3, 4]],
          index: 0
        }

        mutations['SHOW_NEXT_HINT'](state)

        expect(state.index).toEqual(1)
      })

      it('should reset the index to zero if incrementing it exceeded the number of entries', () => {
        const state = {
          entries: [[1, 2], [3, 4]],
          index: 1
        }

        mutations['SHOW_NEXT_HINT'](state)

        expect(state.index).toEqual(0)
      })
    })
  })
})
