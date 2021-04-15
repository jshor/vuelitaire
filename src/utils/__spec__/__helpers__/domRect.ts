export default class DOMRect {

  public left: number = 0
  public top: number = 0
  public bottom: number = 0
  public right: number = 0
  public width: number = 0
  public height: number = 0
  public x: number = 0
  public y: number = 0
  public toJSON: () => any
  constructor (top: number, left: number) {
    this.top = top
    this.left = left
  }
}
