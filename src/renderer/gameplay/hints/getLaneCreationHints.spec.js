import Card from '../../store/models/Card'
import LaneSpace from '../../store/models/LaneSpace'
import { Suits } from '../../constants'
import getLaneCreationHints from './getLaneCreationHints'

describe('Lane creation', () => {
  it('should return multiple hints if multiple kings can be moved to a space', () => {
    const space = new LaneSpace()
    const kingOfHearts = new Card(Suits.HEARTS, 12)
    const kingOfSpades = new Card(Suits.SPADES, 12)
    const allCards = [space, kingOfHearts, kingOfSpades]

    const hints = getLaneCreationHints(allCards, [kingOfHearts, kingOfSpades])

    expect(hints).toEqual(
      expect.arrayContaining([
        expect.arrayContaining([kingOfHearts.id, space.id]),
        expect.arrayContaining([kingOfSpades.id, space.id])
      ])
    )
  })

  it('should return multiple hints if one king can be moved to multiple spaces', () => {
    const space1 = new LaneSpace()
    const space2 = new LaneSpace()
    const kingOfHearts = new Card(Suits.HEARTS, 12)
    const allCards = [space1, space2, kingOfHearts]

    const hints = getLaneCreationHints(allCards, [kingOfHearts])

    expect(hints).toEqual(
      expect.arrayContaining([
        expect.arrayContaining([kingOfHearts.id, space1.id]),
        expect.arrayContaining([kingOfHearts.id, space2.id])
      ])
    )
  })

  it('should return multiple hints if multiple kings can be moved to multiple spaces', () => {
    const space1 = new LaneSpace()
    const space2 = new LaneSpace()
    const kingOfHearts = new Card(Suits.HEARTS, 12)
    const kingOfSpades = new Card(Suits.SPADES, 12)
    const allCards = [space1, space2, kingOfHearts, kingOfSpades]

    const hints = getLaneCreationHints(allCards, [kingOfHearts, kingOfSpades])

    expect(hints).toEqual(
      expect.arrayContaining([
        expect.arrayContaining([kingOfHearts.id, space1.id]),
        expect.arrayContaining([kingOfHearts.id, space2.id]),
        expect.arrayContaining([kingOfSpades.id, space1.id]),
        expect.arrayContaining([kingOfSpades.id, space2.id])
      ])
    )
  })

  it('should not hint that a king should be moved to a space if the space already has a child', () => {
    const space = new LaneSpace()
    const kingOfHearts = new Card(Suits.HEARTS, 12)
    const kingOfSpades = new Card(Suits.SPADES, 12)
    const allCards = [space, kingOfHearts, kingOfSpades]

    space.child = kingOfSpades

    const hints = getLaneCreationHints(allCards, [kingOfHearts, kingOfSpades])

    expect(hints).not.toEqual(
      expect.arrayContaining([
        expect.arrayContaining([kingOfHearts.id, space.id])
      ])
    )
  })

  it('should not hint that a king should be moved to a space if the king has a child', () => {
    const space = new LaneSpace()
    const kingOfHearts = new Card(Suits.HEARTS, 12)
    const queenOfSpades = new Card(Suits.SPADES, 11)
    const allCards = [space, kingOfHearts, queenOfSpades]

    kingOfHearts.child = queenOfSpades

    const hints = getLaneCreationHints(allCards, [kingOfHearts, queenOfSpades])

    expect(hints).not.toEqual(
      expect.arrayContaining([
        expect.arrayContaining([kingOfHearts.id, space.id])
      ])
    )
  })

  it('should not hint that a card of another rank can be moved to a space', () => {
    const space = new LaneSpace()
    const kingOfHearts = new Card(Suits.HEARTS, 12)
    const queenOfSpades = new Card(Suits.SPADES, 11)
    const allCards = [space, kingOfHearts, queenOfSpades]

    const hints = getLaneCreationHints(allCards, [kingOfHearts, queenOfSpades])

    expect(hints).not.toEqual(
      expect.arrayContaining([
        expect.arrayContaining([queenOfSpades.id, space.id])
      ])
    )
  })
})
