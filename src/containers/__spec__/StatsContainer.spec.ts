import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import { useStore } from '@/store/main'
import { Scoring } from '@/constants'
import Stats from '@/components/Stats.vue'
import StatsContainer from '../StatsContainer.vue'

// vi.hoisted ensures this runs before vi.mock so the class can reference instance
const { instance: mockInstance } = vi.hoisted(() => {
  const instance = {
    emitter: { on: vi.fn(), off: vi.fn() },
    start: vi.fn(),
    stop: vi.fn(),
    getTimeElapsed: vi.fn(() => 0)
  }
  return { instance }
})

vi.mock('@/gameplay/Stopwatch', () => ({
  // Use a class so `new Stopwatch()` works; share the same mock functions via reference
  default: class MockStopwatch {
    emitter = mockInstance.emitter
    start = mockInstance.start
    stop = mockInstance.stop
    getTimeElapsed = mockInstance.getTimeElapsed
  }
}))

describe('StatsContainer', () => {
  let pinia: ReturnType<typeof createPinia>
  let store: ReturnType<typeof useStore>

  beforeEach(() => {
    vi.clearAllMocks()
    pinia = createPinia()
    setActivePinia(pinia)
    store = useStore()
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  function mountStats() {
    return shallowMount(StatsContainer, { global: { plugins: [pinia] } })
  }

  /** Retrieves the 'tick' handler registered on the mock emitter. */
  function getTickHandler(): (elapsed: number) => void {
    const call = mockInstance.emitter.on.mock.calls.find(
      ([event]: [string]) => event === 'tick'
    )
    return call?.[1]
  }

  describe('stopwatch lifecycle', () => {
    it('starts the stopwatch on mount', () => {
      mountStats()
      expect(mockInstance.start).toHaveBeenCalledOnce()
    })

    it('stops the stopwatch when the component is unmounted', () => {
      const wrapper = mountStats()
      wrapper.unmount()
      expect(mockInstance.stop).toHaveBeenCalled()
    })
  })

  describe('tick()', () => {
    it('updates the timeElapsed prop passed to the Stats component', async () => {
      const wrapper = mountStats()
      const tick = getTickHandler()
      tick(42)
      await nextTick()
      expect(wrapper.findComponent(Stats).props('timeElapsed')).toBe(42)
    })

    it('calls deductByEpoch when enough time has elapsed for multiple epochs', async () => {
      const deductSpy = vi.spyOn(store, 'deductByEpoch')
      mountStats()
      const tick = getTickHandler()
      // First tick: no full epoch yet so no deduction
      tick(0)
      // Second tick crosses 2 full TIME_PENALTY_MS epochs from the baseline
      tick(Scoring.TIME_PENALTY_MS * 2)
      await nextTick()
      expect(deductSpy).toHaveBeenCalledWith(2)
    })

    it('does not call deductByEpoch when insufficient time has elapsed', async () => {
      const deductSpy = vi.spyOn(store, 'deductByEpoch')
      mountStats()
      const tick = getTickHandler()
      tick(Scoring.TIME_PENALTY_MS - 1)
      await nextTick()
      expect(deductSpy).not.toHaveBeenCalled()
    })
  })

  describe('handleStatsUpdate()', () => {
    it('stops the stopwatch and computes the bonus when the game becomes complete', async () => {
      const computeBonusSpy = vi.spyOn(store, 'computeBonus')
      mockInstance.getTimeElapsed.mockReturnValue(99)

      // Start with a non-complete game so isComplete can transition to true
      store.newGame()
      mountStats()

      // Clear the tableaux children to make isComplete === true
      Object.values(store.tableau).forEach(lane => { lane.child = undefined })
      store.dealSpace.child = undefined

      await nextTick()
      await nextTick()

      expect(mockInstance.stop).toHaveBeenCalled()
      expect(computeBonusSpy).toHaveBeenCalledWith(99)
    })

    it('does not stop the stopwatch when the game is not complete', async () => {
      const computeBonusSpy = vi.spyOn(store, 'computeBonus')
      store.newGame()
      mountStats()
      // isComplete stays false (tableau has cards)
      await nextTick()
      expect(computeBonusSpy).not.toHaveBeenCalled()
    })
  })
})
