import Pair from '../../../models/Pair'
import animation from '../animation'
import IAnimationState from '../../../interfaces/IAnimationState'
import invokeAction from './__helpers__/invokeAction'

const {
  actions,
  mutations
} = animation

const createState = (): IAnimationState => (<IAnimationState>{ ...animation.state })

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

      it('should reset the animation to an empty pair after the specified time', (done) => {
        const promise: Promise<void> = invokeAction(actions, 'move', { commit }, move)

        expect.assertions(5)
        expect(commit).toHaveBeenCalledWith('SET_IN_PROGRESS', true)
        expect(commit).toHaveBeenCalledWith('SET_ANIMATION', move)

        promise.then(() => {
          expect(commit).toHaveBeenCalledTimes(4)
          expect(commit).toHaveBeenCalledWith('SET_ANIMATION', expect.objectContaining(new Pair()))
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
  })
})
