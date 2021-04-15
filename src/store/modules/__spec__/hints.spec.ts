import IHintsState from '@/interfaces/IHintsState'
import hints from '../hints'
import invokeAction from './__helpers__/invokeAction'

const {
  actions,
  mutations
} = hints

const createState = (): IHintsState => ({ ...hints.state } as IHintsState)

jest.mock('@/gameplay/hints/', () => () => [])

describe('Vuex hints module', () => {
  describe('actions', () => {
    const dispatch = jest.fn()
    const commit = jest.fn()

    afterEach(() => jest.resetAllMocks())

    describe('showHint()', () => {
      it('should generate new hints when no hints have been generated yet', () => {
        const state: IHintsState = createState()

        invokeAction(actions, 'showHint', { commit, dispatch, state })

        expect(dispatch).toHaveBeenCalledTimes(1)
        expect(dispatch).toHaveBeenCalledWith('generateHints')
        expect(commit).toHaveBeenCalledTimes(1)
        expect(commit).toHaveBeenCalledWith('SHOW_NEXT_HINT')
      })

      it('should not generate new hints when hints already exist in the state', () => {
        const state: IHintsState = createState()

        state.entries = [['DEAL_CARD']]

        invokeAction(actions, 'showHint', { commit, dispatch, state })

        expect(dispatch).not.toHaveBeenCalled()
        expect(commit).toHaveBeenCalledTimes(1)
        expect(commit).toHaveBeenCalledWith('SHOW_NEXT_HINT')
      })
    })

    describe('generateHints()', () => {
      it('should generate a list of hints and add them to the entries, including the default one', () => {
        const rootState = {
          deck: {
            waste: [],
            stock: []
          }
        }

        invokeAction(actions, 'generateHints', { rootState, dispatch, commit })

        expect(commit).toHaveBeenCalledTimes(1)
        expect(commit).toHaveBeenCalledWith('SET_HINTS', expect.any(Array))
      })
    })
  })

  describe('mutations', () => {
    describe('CLEAR_HINTS', () => {
      it('should clear the current hint entries and index', () => {
        const state: IHintsState = createState()

        state.entries = [['card-1', 'card-2'], ['card-3', 'card-4']]
        state.index = 1

        mutations.CLEAR_HINTS(state)

        expect(state.entries).toHaveLength(0)
        expect(state.index).toEqual(-1)
      })
    })

    describe('SET_HINTS', () => {
      it('should apply the given hints to the state entries', () => {
        const hints: string[][] = [['card-1', 'card-2'], ['card-3', 'card-4']]
        const state: IHintsState = createState()

        mutations.SET_HINTS(state, hints)

        expect(state.entries).toEqual(hints)
      })
    })

    describe('SHOW_NEXT_HINT', () => {
      it('should increment the index', () => {
        const state: IHintsState = createState()

        state.entries = [['card-1', 'card-2'], ['card-3', 'card-4']]
        state.index = 0

        mutations.SHOW_NEXT_HINT(state)

        expect(state.index).toEqual(1)
      })

      it('should reset the index to zero if incrementing it exceeded the number of entries', () => {
        const state: IHintsState = createState()

        state.entries = [['card-1', 'card-2'], ['card-3', 'card-4']]
        state.index = 1

        mutations.SHOW_NEXT_HINT(state)

        expect(state.index).toEqual(0)
      })
    })
  })
})
