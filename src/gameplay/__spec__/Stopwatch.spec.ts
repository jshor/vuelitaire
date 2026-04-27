import Stopwatch from '../Stopwatch'

describe('Stopwatch', () => {
  let stopwatch: Stopwatch

  beforeEach(() => {
    vi.useFakeTimers()
    stopwatch = new Stopwatch()
  })

  afterEach(() => {
    vi.resetAllMocks()
    vi.clearAllTimers()
  })

  describe('getTimeElapsed()', () => {
    it('should equal two seconds when 2000 milliseconds have passed', () => {
      const elapsed: number = 2000
      let time: number = 0

      vi
        .spyOn(Date, 'now')
        .mockImplementation(() => {
          time += 500
          return time
        })

      stopwatch.start()
      vi.advanceTimersByTime(elapsed)
      stopwatch.stop()

      expect(stopwatch.getTimeElapsed()).toEqual(2)
    })
  })

  describe('clear()', () => {
    it('should stop the stopwatch', () => {
      vi.spyOn(stopwatch, 'stop')
      stopwatch.clear()

      expect(stopwatch.stop).toHaveBeenCalledTimes(1)
    })

    it('should return 0 for the time elapsed', () => {
      stopwatch.start()
      vi.advanceTimersByTime(4321)
      stopwatch.clear()

      expect(stopwatch.getTimeElapsed()).toEqual(0)
    })
  })

  describe('stop()', () => {
    beforeEach(() => vi.spyOn(window, 'clearInterval'))

    it('should not clear the interval if the stopwatch was never started', () => {
      stopwatch.stop()

      expect(window.clearInterval).not.toHaveBeenCalled()
    })

    it('should clear the interval', () => {
      stopwatch.start()
      stopwatch.stop()

      expect(window.clearInterval).toHaveBeenCalledTimes(1)
    })
  })
})
