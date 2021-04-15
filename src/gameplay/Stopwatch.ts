import EventEmitter from 'events'

/**
 * A simple stopwatch class to keep track of time in seconds.
 */
export default class Stopwatch {
  /**
   * Emitter for the `tick` event.
   *
   * @emits tick
   */
  public emitter: EventEmitter = new EventEmitter()

  /**
   * Time, in seconds, since the last time the elapsed time was checked.
   * This variable's value is updated in `elapse()`.
   */
  private timeElapsed: number = 0

  /**
   * `setInterval()` instance.
   */
  private interval: number

  /**
   * Time, in UNIX milliseconds, when the timer was started.
   */
  private startTime: number = 0

  /**
   * Returns the number of seconds that have elapsed since the timer was started.
   *
   * @returns {number} time, in seconds
   */
  public getTimeElapsed = (): number => {
    if (this.startTime > 0) {
      return Math.floor((Date.now() - this.startTime) / 1000)
    }
    return 0
  }

  /**
   * Starts the timer.
   */
  public start = (): void => {
    this.startTime = Date.now()
    this.interval = window.setInterval(this.elapse.bind(this), 500)
  }

  /**
   * Stops the timer.
   */
  public stop = (): void => {
    if (this.interval > 0) {
      window.clearInterval(this.interval)
      this.interval = 0
    }
  }

  /**
   * Clears the timer. If a timer is in progress, stops it.
   */
  public clear = (): void => {
    this.stop()
    this.timeElapsed = 0
    this.startTime = 0
  }

  /**
   * Updates the time elapsed and emits the `tick` event with that value.
   *
   * @private
   */
  private elapse = (): void => {
    const timeElapsed = this.getTimeElapsed()

    if (timeElapsed > this.timeElapsed) {
      this.timeElapsed = timeElapsed
      this.emitter.emit('tick', this.timeElapsed)
    }
  }
}
