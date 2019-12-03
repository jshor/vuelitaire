import bonus from '../bonus'

describe('bonus()', () => {
  it('should return 0 when the time elapsed is less than 30 seconds', () => {
    expect(bonus(29)).toEqual(0)
  })

  it('should return 23334 when the time elapsed is 30 seconds or more', () => {
    expect(bonus(30)).toEqual(23334)
  })
})
