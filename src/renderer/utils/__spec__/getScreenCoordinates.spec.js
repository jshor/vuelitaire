import getScreenCoordinates from '../getScreenCoordinates'
import ScreenPoint from '../../models/ScreenPoint'

describe('getScreenCoordinates()', () => {
  const left = 20
  const top = 30

  beforeAll(() => {
    // https://github.com/jsdom/jsdom/issues/653
    Element.prototype.getBoundingClientRect = () => ({ left, top })
  })

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
