import stats from '../stats'
import invokeAction from './__helpers__/invokeAction'
import IStatsState from '@/interfaces/IStatsState'
import { Scoring } from '@/constants'

const {
  actions,
  mutations
} = stats

const createState = (): IStatsState => (<IStatsState>{ ...stats.state })

describe('Vuex hints module', () => {
  describe('actions', () => {
    const commit = jest.fn()

    afterEach(() => jest.resetAllMocks())

    describe('deductByEpoch()', () => {
      it('should deduct the epochs passed times the score penalty from the points', () => {
        const epochs: number = 3

        invokeAction(actions, 'deductByEpoch', { commit }, epochs)

        expect(commit).toHaveBeenCalledTimes(1)
        expect(commit).toHaveBeenCalledWith('UPDATE_POINTS', epochs * Scoring.TIME_PENALTY_POINTS)
      })
    })
  })

  describe('mutations', () => {
    describe('UPDATE_POINTS', () => {
      it('should increment points by the given positive value', () => {
        const state: IStatsState = createState()

        state.points = 15

        mutations.UPDATE_POINTS(state, 10)

        expect(state.points).toEqual(25)
      })

      it('should decrement points by the given negative value', () => {
        const state: IStatsState = createState()

        state.points = 15

        mutations.UPDATE_POINTS(state, -10)

        expect(state.points).toEqual(5)
      })

      it('should not change the score if one was not passed in', () => {
        const state: IStatsState = createState()

        state.points = 15

        mutations.UPDATE_POINTS(state)

        expect(state.points).toEqual(15)
      })
    })
  })
})
