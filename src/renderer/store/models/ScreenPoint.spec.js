import ScreenPoint from './ScreenPoint'

describe('ScreenPoint model', () => {
  it('should set the left and top params', () => {
    const left = 4
    const top = 20
    const point = new ScreenPoint(left, top)

    expect(point).toHaveProperty('left')
    expect(point.left).toEqual(left)
    expect(point).toHaveProperty('top')
    expect(point.top).toEqual(top)
  })

  it('should return the difference between two points', () => {
    const pointA = new ScreenPoint(20, 30)
    const pointB = new ScreenPoint(10, 7)
    const result = pointA.diff(pointB)

    expect(result.left).toEqual(10)
    expect(result.top).toEqual(23)
  })

  it('should return the CSS poisitioning representation of the point', () => {
    const point = new ScreenPoint(20, 30)

    expect(point.asStyle()).toEqual(expect.objectContaining({
      left: '20px',
      top: '30px'
    }))
  })

  describe('from()', () => {
    it('should return a new ScreenPoint with the given coordinates', () => {
      const point = { left: 3, top: 5 }
      const result = ScreenPoint.from(point)

      expect(result).toBeInstanceOf(ScreenPoint)
      expect(result.left).toEqual(point.left)
      expect(result.top).toEqual(point.top)
    })
  })
})
