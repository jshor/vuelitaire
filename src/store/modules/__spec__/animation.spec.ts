import IAnimationState from '@/interfaces/IAnimationState'
import Pair from '@/models/Pair'
import animation from '../animation'
import invokeAction from './__helpers__/invokeAction'

const {
  actions,
  mutations
} = animation

const createState = (): IAnimationState => ({ ...animation.state } as IAnimationState)

describe('Vuex animation module', () => {
  beforeEach(() => jest.useFakeTimers())

  afterEach(() => jest.resetAllMocks())

  describe('actions', () => {
    const commit = jest.fn()
    const dispatch = jest.fn()

    describe('reverse()', () => {
      it('should dispatch the `move` action with the given pair', () => {
        const move = new Pair('some-card-id', 'some-target-id')

        move.parentId = 'some-parent-id'
        invokeAction(actions, 'reverse', { dispatch }, move)

        expect(dispatch).toHaveBeenCalledTimes(1)
        expect(dispatch).toHaveBeenCalledWith('move', expect.objectContaining({
          cardId: 'some-card-id',
          targetId: 'some-parent-id'
        }))
      })
    })

    describe('move()', () => {
      const move: Pair = new Pair('some-card-id', 'some-target-id')

      it('should set the move animation before resetting it', async () => {
        invokeAction(actions, 'move', { commit, dispatch }, move)

        expect(commit).toHaveBeenCalledTimes(1)
        expect(commit).toHaveBeenCalledWith('SET_ANIMATION', move)
      })

      it('should reset the move animation after halting user interaction', async () => {
        await invokeAction(actions, 'move', { commit, dispatch }, move)

        expect(dispatch).toHaveBeenCalledTimes(1)
        expect(dispatch).toHaveBeenCalledWith('wait')
        expect(commit).toHaveBeenCalledTimes(2)
        expect(commit).toHaveBeenLastCalledWith('SET_ANIMATION', expect.objectContaining(new Pair()))
      })
    })

    describe('wait()', () => {
      it('should reset the animation after the specified time', (done) => {
        const promise = invokeAction(actions, 'wait', { commit }, 10)

        expect.assertions(3)
        expect(commit).toHaveBeenCalledWith('SET_IN_PROGRESS', true)

        promise.then(() => {
          expect(commit).toHaveBeenCalledTimes(2)
          expect(commit).toHaveBeenCalledWith('SET_IN_PROGRESS', false)
          done()
        })
        jest.runAllTimers()
      })

      it('should fall back to a default time if no time is specified', (done) => {
        const promise = invokeAction(actions, 'wait', { commit })

        expect.assertions(3)
        expect(commit).toHaveBeenCalledWith('SET_IN_PROGRESS', true)

        promise.then(() => {
          expect(commit).toHaveBeenCalledTimes(2)
          expect(commit).toHaveBeenCalledWith('SET_IN_PROGRESS', false)
          done()
        })
        jest.runAllTimers()
      })
    })
  })

  describe('mutations', () => {
    describe('SET_ANIMATION', () => {
      it('should set the state\'s cardId and targetId with the ones in the given pair', () => {
        const cardId: string = 'some-card-id'
        const targetId: string = 'some-target-id'
        const state: IAnimationState = createState()

        mutations.SET_ANIMATION(state, new Pair(cardId, targetId))

        expect(state.cardId).toEqual(cardId)
        expect(state.targetId).toEqual(targetId)
      })
    })

    describe('SET_IN_PROGRESS', () => {
      it('should update `inProgress` to `true`', () => {
        const inProgress: boolean = true
        const state: IAnimationState = createState()

        mutations.SET_IN_PROGRESS(state, inProgress)

        expect(state.inProgress).toEqual(inProgress)
      })
    })
  })
})
