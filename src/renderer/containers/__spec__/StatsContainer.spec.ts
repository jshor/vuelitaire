import { Scoring } from '@/constants'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import StatsContainer from '../StatsContainer.vue'

const localVue = createLocalVue()

localVue.use(Vuex)

describe('Stats Container', () => {
  let wrapper

  beforeAll(() => jest.useFakeTimers())

  beforeEach(() => {
    const stats = {
      namespaced: true,
      actions: {
        deductByEpoch: jest.fn()
      },
      state: {
        points: 0,
        timeElapsed: 0
      }
    }

    wrapper = shallowMount(StatsContainer, {
      localVue,
      sync: false,
      store: new Vuex.Store({
        modules: {
          stats
        }
      })
    })
    wrapper.vm.stopwatch.stop()
  })

  afterEach(() => jest.resetAllMocks())

  describe('tick()', () => {
    beforeEach(() => {
      jest.spyOn(wrapper.vm, 'deductByEpoch')
    })

    it('should inform the store that an epoch has passed', () => {
      const timeElapsed: number = Scoring.TIME_PENALTY_MS * 3

      wrapper.vm.lastEpoch = Scoring.TIME_PENALTY_MS
      wrapper.vm.tick(timeElapsed)

      expect(wrapper.vm.deductByEpoch).toHaveBeenCalledTimes(1)
      expect(wrapper.vm.deductByEpoch).toHaveBeenCalledWith(2)
      expect(wrapper.vm.lastEpoch).toEqual(timeElapsed)
    })

    it('should not dispatch deductByEpoch() if an insufficient amount of time has passed', () => {
      const timeElapsed: number = Scoring.TIME_PENALTY_MS

      wrapper.vm.lastEpoch = Scoring.TIME_PENALTY_MS
      wrapper.vm.tick(timeElapsed)

      expect(wrapper.vm.deductByEpoch).not.toHaveBeenCalled()
    })

    it('should update secondsElapsed with the given time value', () => {
      const timeElapsed: number = 42

      wrapper.vm.tick(timeElapsed)

      expect(wrapper.vm.timeElapsed).toEqual(timeElapsed)
    })
  })

  describe('when the component is destroyed', () => {
    it('should stop the stopwatch', () => {
      jest.spyOn(wrapper.vm.stopwatch, 'stop')

      wrapper.destroy()

      expect(wrapper.vm.stopwatch.stop).toHaveBeenCalledTimes(1)
    })
  })
})
