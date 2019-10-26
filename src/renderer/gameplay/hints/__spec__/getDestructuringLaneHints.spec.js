import getDestructuringLaneHints from '../getDestructuringLaneHints'
import Card from '../../../store/models/Card'
import FoundationSpace from '../../../store/models/FoundationSpace'
import { Suits } from '../../../constants'

function makePlayable (cards) {
  cards.forEach(card => {
    card.isPlayed = card.revealed = true
  })
}

describe('getDestructuringLaneHints()', () => {
  it('should create a hint for making a five of hearts promotable', () => {
    const foundation = new FoundationSpace()
    const aceOfSpades = new Card(Suits.SPADES, 0) // promoted
    const twoOfSpades = new Card(Suits.SPADES, 1) // card to promote
    const aceOfHearts = new Card(Suits.HEARTS, 0) // card blocking the two of spades from promotion
    const twoOfClubs = new Card(Suits.CLUBS, 1) // alternate card to move the ace of hearts onto
    const cards = [foundation, aceOfSpades, twoOfSpades, aceOfHearts, twoOfClubs]

    makePlayable(cards)

    foundation.child = aceOfSpades
    twoOfSpades.child = aceOfHearts
    aceOfSpades.promoted = true

    const hints = getDestructuringLaneHints(cards)

    expect(hints).toEqual(
      expect.arrayContaining([
        expect.arrayContaining([aceOfHearts.id, twoOfClubs.id])
      ])
    )
  })

  it('should not create a hint if there is no alternate card to destructure the lane to', () => {
    const foundation = new FoundationSpace()
    const aceOfSpades = new Card(Suits.SPADES, 0) // promoted
    const twoOfSpades = new Card(Suits.SPADES, 1) // card to promote
    const aceOfHearts = new Card(Suits.HEARTS, 0) // card blocking the Ace of spades from promotion
    const cards = [foundation, aceOfSpades, twoOfSpades, aceOfHearts]

    makePlayable(cards)

    foundation.child = aceOfSpades
    twoOfSpades.child = aceOfHearts
    aceOfSpades.promoted = true

    const hints = getDestructuringLaneHints(cards)

    expect(hints).not.toEqual(
      expect.arrayContaining([
        expect.arrayContaining([aceOfHearts.id])
      ])
    )
  })

  it('should not create a hint if there are no cards blocked from promotion', () => {
    const foundation = new FoundationSpace()
    const aceOfSpades = new Card(Suits.SPADES, 0) // promoted
    const twoOfSpades = new Card(Suits.SPADES, 1) // card to promote
    const cards = [foundation, aceOfSpades, twoOfSpades]

    makePlayable(cards)

    foundation.child = aceOfSpades
    aceOfSpades.promoted = true

    const hints = getDestructuringLaneHints(cards)

    expect(hints).toHaveLength(0)
  })
})
