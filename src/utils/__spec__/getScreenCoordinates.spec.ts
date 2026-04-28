import ScreenPoint from '@/types/ScreenPoint'
import getScreenCoordinates from '../getScreenCoordinates'

describe('getScreenCoordinates()', () => {
  const left = 0
  const top = 0

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('should return the top left ScreenPoint of the element if it exists', () => {
    const element = document.createElement('div')

    element.id = 'test-div'
    document.body.appendChild(element)

    const point = getScreenCoordinates('#test-div')

    expect(point).toBeInstanceOf(ScreenPoint)
    expect(point.left).toEqual(left)
    expect(point.top).toEqual(top)
  })

  it('should return the origin ScreenPoint if the element does not exist', () => {
    const point = getScreenCoordinates('#non-existant-element')

    expect(point).toBeInstanceOf(ScreenPoint)
    expect(point.left).toEqual(0)
    expect(point.top).toEqual(0)
  })
})
