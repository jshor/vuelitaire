import Stopwatch from '../Stopwatch'

describe('Stopwatch', () => {
  let stopwatch: Stopwatch

  beforeEach(() => {
    jest.useFakeTimers()
    stopwatch = new Stopwatch()
  })

  afterEach(() => {
    jest.resetAllMocks()
    jest.clearAllTimers()
  })

  describe('getTimeElapsed()', () => {
    it('should equal two seconds when 2000 milliseconds have passed', () => {
      const elapsed: number = 2000
      let time: number = 0

      jest
        .spyOn(Date, 'now')
        .mockImplementation(() => {
          time += 500
          return time
        })

      stopwatch.start()
      jest.advanceTimersByTime(elapsed)
      stopwatch.stop()

      expect(stopwatch.getTimeElapsed()).toEqual(2)
    })
  })

  describe('clear()', () => {
    it('should stop the stopwatch', () => {
      jest.spyOn(stopwatch, 'stop')
      stopwatch.clear()

      expect(stopwatch.stop).toHaveBeenCalledTimes(1)
    })

    it('should return 0 for the time elapsed', () => {
      stopwatch.start()
      jest.advanceTimersByTime(4321)
      stopwatch.clear()

      expect(stopwatch.getTimeElapsed()).toEqual(0)
    })
  })

  describe('stop()', () => {
    beforeEach(() => jest.spyOn(window, 'clearInterval'))

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
