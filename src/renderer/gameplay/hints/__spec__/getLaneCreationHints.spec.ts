import Card from '../../../models/Card'
import LaneSpace from '../../../models/LaneSpace'
import { Suits } from '../../../constants'
import getLaneCreationHints from '../getLaneCreationHints'
import ICard from '../../../interfaces/ICard'
import createDeckState from './__helpers__/createDeckState'
import IDeckState from '../../../interfaces/IDeckState'


describe('Lane creation', () => {
  const deck: IDeckState = createDeckState()

  it('should return multiple hints if multiple kings can be moved to a space', () => {
    const space: ICard = new LaneSpace()
    const kingOfHearts: ICard = new Card(Suits.HEARTS, 12)
    const kingOfSpades: ICard = new Card(Suits.SPADES, 12)
    const allCards: ICard[] = [space, kingOfHearts, kingOfSpades]

    const hints: string[][] = getLaneCreationHints(allCards, [kingOfHearts, kingOfSpades], deck)

    expect(hints).toEqual(
      expect.arrayContaining([
        expect.arrayContaining([kingOfHearts.id, space.id]),
        expect.arrayContaining([kingOfSpades.id, space.id])
      ])
    )
  })

  it('should return multiple hints if one king can be moved to multiple spaces', () => {
    const space1: ICard = new LaneSpace()
    const space2: ICard = new LaneSpace()
    const kingOfHearts: ICard = new Card(Suits.HEARTS, 12)
    const allCards: ICard[] = [space1, space2, kingOfHearts]

    const hints: string[][] = getLaneCreationHints(allCards, [kingOfHearts], deck)

    expect(hints).toEqual(
      expect.arrayContaining([
        expect.arrayContaining([kingOfHearts.id, space1.id]),
        expect.arrayContaining([kingOfHearts.id, space2.id])
      ])
    )
  })

  it('should return multiple hints if multiple kings can be moved to multiple spaces', () => {
    const space1: ICard = new LaneSpace()
    const space2: ICard = new LaneSpace()
    const kingOfHearts: ICard = new Card(Suits.HEARTS, 12)
    const kingOfSpades: ICard = new Card(Suits.SPADES, 12)
    const allCards: ICard[] = [space1, space2, kingOfHearts, kingOfSpades]

    const hints: string[][] = getLaneCreationHints(allCards, [kingOfHearts, kingOfSpades], deck)

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
    const space: ICard = new LaneSpace()
    const kingOfHearts: ICard = new Card(Suits.HEARTS, 12)
    const kingOfSpades: ICard = new Card(Suits.SPADES, 12)
    const allCards: ICard[] = [space, kingOfHearts, kingOfSpades]

    space.child = kingOfSpades

    const hints: string[][] = getLaneCreationHints(allCards, [kingOfHearts, kingOfSpades], deck)

    expect(hints).not.toEqual(
      expect.arrayContaining([
        expect.arrayContaining([kingOfHearts.id, space.id])
      ])
    )
  })

  it('should not hint that a king should be moved to a space if the king has a child', () => {
    const space: ICard = new LaneSpace()
    const kingOfHearts: ICard = new Card(Suits.HEARTS, 12)
    const queenOfSpades: ICard = new Card(Suits.SPADES, 11)
    const allCards: ICard[] = [space, kingOfHearts, queenOfSpades]

    kingOfHearts.child = queenOfSpades

    const hints: string[][] = getLaneCreationHints(allCards, [kingOfHearts, queenOfSpades], deck)

    expect(hints).not.toEqual(
      expect.arrayContaining([
        expect.arrayContaining([kingOfHearts.id, space.id])
      ])
    )
  })

  it('should not hint that a card of another rank can be moved to a space', () => {
    const space: ICard = new LaneSpace()
    const kingOfHearts: ICard = new Card(Suits.HEARTS, 12)
    const queenOfSpades: ICard = new Card(Suits.SPADES, 11)
    const allCards: ICard[] = [space, kingOfHearts, queenOfSpades]

    const hints: string[][] = getLaneCreationHints(allCards, [kingOfHearts, queenOfSpades], deck)

    expect(hints).not.toEqual(
      expect.arrayContaining([
        expect.arrayContaining([queenOfSpades.id, space.id])
      ])
    )
  })
})
