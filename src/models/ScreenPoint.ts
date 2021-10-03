/**
 * Describes a position relative to the top left corner of the screen.
 */
export default class ScreenPoint {
  /**
   * Converts the given plain object to a ScreenPoint.
   *
   * @param {Object<{ left: number, top: number }>} point
   * @returns {ScreenPoint}
   */
  public static from = ({ left, top }: { left: number, top: number }) => {
    return new ScreenPoint(left, top)
  }

  /**
   * Left (x) position.
   *
   * @type {number}
   */
  public left: number = 0

  /**
   * Top (y) position.
   *
   * @type {number}
   */
  public top: number = 0

  /**
   * @param {number} x - left coordinate
   * @param {number} y - top coordinate
   */
  constructor (x: number, y: number) {
    this.left = x
    this.top = y
  }

  /**
   * Finds the difference between this point and the given one.
   *
   * @param {ScreenPoint} point - point to find the difference of
   * @returns {ScreenPoint}
   */
  public diff = ({ left, top }: ScreenPoint) => {
    return new ScreenPoint(
      this.left - left,
      this.top - top
    )
  }

  /**
   * Returns the CSS positioning representation of the point.
   *
   * @returns {Object<{ left: string, top: string }>}
   */
   public asStyle = (): { left: string, top: string } => {
    return {
      left: `${this.left}px`,
      top: `${this.top}px`
    }
  }
}
