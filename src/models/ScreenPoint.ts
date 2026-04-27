export class ScreenPoint {
  public left: number
  public top: number

  constructor (left: number, top: number) {
    this.left = left
    this.top = top
  }

  diff (other: ScreenPoint): ScreenPoint {
    return new ScreenPoint(this.left - other.left, this.top - other.top)
  }

  asStyle (): { left: string; top: string } {
    return {
      left: `${this.left}px`,
      top: `${this.top}px`
    }
  }

  static from ({ left, top }: { left: number; top: number }): ScreenPoint {
    return new ScreenPoint(left, top)
  }
}
