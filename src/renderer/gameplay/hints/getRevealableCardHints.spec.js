import getRevealableCardHints from './getRevealableCardHints'
import Card from '../../store/models/Card'

describe('Hint: getRevealableCardHints', () => {
  it('should include revealable cards', () => {
    const card = new Card()

    card.revealed = false
    card.child = null
    card.isPlayed = true

    expect(getRevealableCardHints([card])).toEqual(expect.arrayContaining([
      expect.arrayContaining([card.id])
    ]))
  })

  it('should not include cards which are already revealed', () => {
    const card = new Card()

    card.revealed = true
    card.child = null
    card.isPlayed = true

    expect(getRevealableCardHints([card])).not.toEqual(expect.arrayContaining([
      expect.arrayContaining([card.id])
    ]))
  })

  it('should not include cards which are not yet in play', () => {
    const card = new Card()

    card.revealed = false
    card.child = null
    card.isPlayed = false

    expect(getRevealableCardHints([card])).not.toEqual(expect.arrayContaining([
      expect.arrayContaining([card.id])
    ]))
  })

  it('should not include cards which have children', () => {
    const card = new Card()

    card.revealed = true
    card.child = new Card()
    card.isPlayed = true

    expect(getRevealableCardHints([card])).not.toEqual(expect.arrayContaining([
      expect.arrayContaining([card.id])
    ]))
  })
})
