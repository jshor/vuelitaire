/**
 * Describes a position relative to the top left corner of the screen.
 */
export default class ScreenPoint {
  /**
   * @param {Number} x - left coordinate
   * @param {Number} y - top coordinate
   */
  constructor (x, y) {
    this.left = x
    this.top = y
  }

  /**
   * Finds the difference between this point and the given one.
   *
   * @param {ScreenPoint} point - point to find the difference of
   * @returns {ScreenPoint}
   */
  diff ({ left, top }) {
    return new ScreenPoint(
      this.left - left,
      this.top - top
    )
  }

  /**
   * Returns the CSS positioning representation of the point.
   *
   * @returns {Object}
   */
  asStyle () {
    return {
      left: `${this.left}px`,
      top: `${this.top}px`
    }
  }

  /**
   * Converts the given plain object to a ScreenPoint.
   *
   * @param {Object} point
   */
  static from ({ left, top }) {
    return new ScreenPoint(left, top)
  }
}
