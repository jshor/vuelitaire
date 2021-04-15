import { Scoring } from '@/constants'
import { Suits } from '@/constants'
import scoring from '@/gameplay/scoring'
import winning from '@/gameplay/winning'
import IRootState from '@/interfaces/IRootState'
import IStatsState from '@/interfaces/IStatsState'
import Card from '@/models/Card'
import FoundationSpace from '@/models/FoundationSpace'
import Pair from '@/models/Pair'
import stats from '../stats'
import invokeAction from './__helpers__/invokeAction'

const {
  actions,
  mutations
} = stats

const createState = (): IStatsState => ({ ...stats.state } as IStatsState)

describe('Vuex stats module', () => {
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

    describe('computeBonus()', () => {
      it('should compute the bonus awarded for completing the game', () => {
        const points: number = 1000

        jest
          .spyOn(scoring, 'bonus')
          .mockReturnValue(points)

        const rootState: IRootState = {
          selectedCard: null,
          gameId: null,
          revertibleStates: []
        }

        invokeAction(actions, 'computeBonus', { commit, rootState }, 42)

        expect(commit).toHaveBeenCalledTimes(1)
        expect(commit).toHaveBeenCalledWith('UPDATE_POINTS', 1000)
      })
    })

    describe('deductByDeal()', () => {
      it('should deduct points for resetting the deck', () => {
        const points: number = -100

        jest
          .spyOn(scoring, 'dealDeduction')
          .mockReturnValue(points)

        const rootState: IRootState = {
          selectedCard: null,
          gameId: null,
          revertibleStates: []
        }

        invokeAction(actions, 'deductByDeal', { commit, rootState })

        expect(commit).toHaveBeenCalledTimes(1)
        expect(commit).toHaveBeenCalledWith('UPDATE_POINTS', points)
      })
    })

    describe('accruePointsByMove()', () => {
      it('should accure the points based on the given move', () => {
        const points: number = 15

        jest
          .spyOn(scoring, 'cardMove')
          .mockReturnValue(points)

        const card = new Card(Suits.SPADES, 0)
        const foundation = new FoundationSpace()
        const move = new Pair(card.id, foundation.id)
        const rootState: IRootState = {
          selectedCard: null,
          gameId: null,
          revertibleStates: []
        }

        invokeAction(actions, 'accruePointsByMove', { commit, rootState }, move)

        expect(commit).toHaveBeenCalledTimes(1)
        expect(commit).toHaveBeenCalledWith('UPDATE_POINTS', points)
      })
    })

    describe('determineWinningStatus()', () => {
      beforeEach(() => {
        jest
          .spyOn(winning, 'isWinningMove')
          .mockReturnValue(false)

        jest
          .spyOn(winning, 'canAutocomplete')
          .mockReturnValue(false)
      })

      it('should set the winning status to true if the game is won', () => {
        jest
          .spyOn(winning, 'isWinningMove')
          .mockReturnValue(true)

        const card = new Card(Suits.SPADES, 0)
        const foundation = new FoundationSpace()
        const move = new Pair(card.id, foundation.id)
        const rootState: IRootState = {
          selectedCard: null,
          gameId: null,
          revertibleStates: []
        }

        invokeAction(actions, 'determineWinningStatus', { commit, rootState }, move)

        expect(commit).toHaveBeenCalledTimes(1)
        expect(commit).toHaveBeenCalledWith('SET_IS_WINNING', true)
      })

      it('should set the autocomplete flag to true if the game is in an autoplayable state', () => {
        jest
          .spyOn(winning, 'canAutocomplete')
          .mockReturnValue(true)

        const card = new Card(Suits.SPADES, 0)
        const foundation = new FoundationSpace()
        const move = new Pair(card.id, foundation.id)
        const rootState: IRootState = {
          selectedCard: null,
          gameId: null,
          revertibleStates: []
        }

        invokeAction(actions, 'determineWinningStatus', { commit, rootState }, move)

        expect(commit).toHaveBeenCalledTimes(1)
        expect(commit).toHaveBeenCalledWith('SET_CAN_AUTOCOMPLETE', true)
      })

      it('should not mutate the state if the game is not won or autoplayable', () => {
        const card = new Card(Suits.SPADES, 0)
        const foundation = new FoundationSpace()
        const move = new Pair(card.id, foundation.id)
        const rootState: IRootState = {
          selectedCard: null,
          gameId: null,
          revertibleStates: []
        }

        invokeAction(actions, 'determineWinningStatus', { commit, rootState }, move)

        expect(commit).not.toHaveBeenCalled()
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

      it('should set the score to zero if the points accumulated falls below zero', () => {
        const state: IStatsState = createState()

        state.points = 5

        mutations.UPDATE_POINTS(state, -10)

        expect(state.points).toEqual(0)
      })
    })

    describe('SET_IS_WINNING', () => {
      it('should set the `isComplete` flag to the given value', () => {
        const isComplete = true
        const state = createState()

        state.isComplete = false

        mutations.SET_IS_WINNING(state, isComplete)

        expect(state.isComplete).toEqual(isComplete)
      })
    })

    describe('SET_CAN_AUTOCOMPLETE', () => {
      it('should set the `isComplete` flag to the given value', () => {
        const canAutocomplete = true
        const state = createState()

        state.canAutocomplete = false

        mutations.SET_CAN_AUTOCOMPLETE(state, canAutocomplete)

        expect(state.canAutocomplete).toEqual(canAutocomplete)
      })
    })
  })
})
