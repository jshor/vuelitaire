import getDestructuringLaneHints from '../getDestructuringLaneHints'
import Card from '@/models/Card'
import FoundationSpace from '@/models/FoundationSpace'
import IDeckState from '@/interfaces/IDeckState'
import ICard from '@/interfaces/ICard'
import { Suits } from '@/constants'
import createDeckState from './__helpers__/createDeckState'

function makePlayable (cards: ICard[]): void {
  cards.forEach((card: ICard): void => {
    card.revealed = true
  })
}

describe('getDestructuringLaneHints()', () => {
  xit('should create a hint for making a five of hearts promotable', () => {
    const foundation: ICard = new FoundationSpace()
    const aceOfSpades: ICard = new Card(Suits.SPADES, 0) // promoted
    const twoOfSpades: ICard = new Card(Suits.SPADES, 1) // card to promote
    const aceOfHearts: ICard = new Card(Suits.HEARTS, 0) // card blocking the two of spades from promotion
    const twoOfClubs: ICard = new Card(Suits.CLUBS, 1) // alternate card to move the ace of hearts onto
    const deck: IDeckState = createDeckState({
      foundations: {
        [foundation.id]: foundation
      },
      tableau: {},
      regular: {
        [aceOfSpades.id]: aceOfSpades,
        [twoOfSpades.id]: twoOfSpades,
        [aceOfHearts.id]: aceOfHearts,
        [twoOfClubs.id]: twoOfClubs
      }
    })
    const cards = Object.values(deck.cards.regular)

    makePlayable(cards)

    foundation.child = aceOfSpades
    twoOfSpades.child = aceOfHearts
    aceOfSpades.promoted = true

    const hints: string[][] = getDestructuringLaneHints(cards, cards, deck)

    expect(hints).toEqual(
      expect.arrayContaining([
        expect.arrayContaining([aceOfHearts.id, twoOfClubs.id])
      ])
    )
  })

  it('should not create a hint if there is no alternate card to destructure the lane to', () => {
    const foundation: ICard = new FoundationSpace()
    const aceOfSpades: ICard = new Card(Suits.SPADES, 0) // promoted
    const twoOfSpades: ICard = new Card(Suits.SPADES, 1) // card to promote
    const aceOfHearts: ICard = new Card(Suits.HEARTS, 0) // card blocking the Ace of spades from promotion
    const deck: IDeckState = createDeckState({
      foundations: {
        [foundation.id]: foundation
      },
      tableau: {},
      regular: {
        [aceOfSpades.id]: aceOfSpades,
        [twoOfSpades.id]: twoOfSpades,
        [aceOfHearts.id]: aceOfHearts
      }
    })
    const cards = Object.values(deck.cards.regular)

    makePlayable(cards)

    foundation.child = aceOfSpades
    twoOfSpades.child = aceOfHearts
    aceOfSpades.promoted = true

    const hints: string[][] = getDestructuringLaneHints(cards, cards, deck)

    expect(hints).not.toEqual(
      expect.arrayContaining([
        expect.arrayContaining([aceOfHearts.id])
      ])
    )
  })

  it('should not create a hint if there are no cards blocked from promotion', () => {
    const foundation: ICard = new FoundationSpace()
    const aceOfSpades: ICard = new Card(Suits.SPADES, 0) // promoted
    const twoOfSpades: ICard = new Card(Suits.SPADES, 1) // card to promote
    const deck: IDeckState = createDeckState({
      foundations: {
        [foundation.id]: foundation
      },
      tableau: {},
      regular: {
        [aceOfSpades.id]: aceOfSpades,
        [twoOfSpades.id]: twoOfSpades
      }
    })
    const cards = Object.values(deck.cards.regular)

    makePlayable(cards)

    foundation.child = aceOfSpades
    aceOfSpades.promoted = true

    const hints: string[][] = getDestructuringLaneHints(cards, cards, deck)

    expect(hints).toHaveLength(0)
  })
})
