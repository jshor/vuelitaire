export default class DOMRect {

  public left = 0
  public top = 0
  public bottom = 0
  public right = 0
  public width = 0
  public height = 0
  public x = 0
  public y = 0
  public toJSON: () => any
  constructor (top: number, left: number) {
    this.top = top
    this.left = left
  }
}
