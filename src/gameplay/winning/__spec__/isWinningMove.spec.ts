import { Suits } from '@/constants'
import ICardsMap from '@/interfaces/ICardsMap'
import IDeckState from '@/interfaces/IDeckState'
import Card from '@/models/Card'
import FoundationSpace from '@/models/FoundationSpace'
import LaneSpace from '@/models/LaneSpace'
import Pair from '@/models/Pair'
import isWinningMove from '../isWinningMove'
import generateDeckState from './__helpers__/generateDeckState'

describe('isWinningMove()', () => {
  const generateFoundationPile = (suit: string, maxRank: number) => {
    const foundation = new FoundationSpace()
    const cards: ICardsMap<Card> = {}
    let parent = foundation
    let rank = 0

    while (rank <= maxRank) {
      const card = new Card(suit, rank)

      cards[parent.id] = parent
      parent.child = card
      parent = card
      rank++
    }

    return { cards, foundation }
  }

  it('should return true if the move is the final King to promote', () => {
    const winningKing = new Card(Suits.CLUBS, 12)
    const winningQueen = new Card(Suits.CLUBS, 11)
    const spades = generateFoundationPile(Suits.SPADES, 12)
    const hearts = generateFoundationPile(Suits.HEARTS, 12)
    const diamonds = generateFoundationPile(Suits.DIAMONDS, 12)
    const clubs = generateFoundationPile(Suits.CLUBS, 12)
    const deck: IDeckState = generateDeckState({
      regular: {
        ...spades.cards,
        ...hearts.cards,
        ...diamonds.cards,
        ...clubs.cards,
        [winningQueen.id]: winningQueen,
        [winningKing.id]: winningKing
      },
      foundations: {
        [spades.foundation.id]: spades.foundation,
        [hearts.foundation.id]: hearts.foundation,
        [diamonds.foundation.id]: diamonds.foundation,
        [clubs.foundation.id]: clubs.foundation
      },
      tableau: {},
      unrevealedCount: 0
    })
    const move = new Pair(winningKing.id, winningQueen.id)

    winningQueen.promoted = true

    expect(isWinningMove(move, deck)).toEqual(true)
  })

  it('should return false if the target is not a promotion', () => {
    const king = new Card(Suits.CLUBS, 12)
    const space = new LaneSpace()
    const deck: IDeckState = generateDeckState({
      regular: {
        [king.id]: king
      },
      foundations: {},
      tableau: {
        [space.id]: space
      },
      unrevealedCount: 0
    })
    const move = new Pair(king.id, space.id)

    expect(isWinningMove(move, deck)).toEqual(false)
  })

  it('should return false if the card moved is not a King', () => {
    const queen = new Card(Suits.CLUBS, 11)
    const jack = new Card(Suits.CLUBS, 10)
    const space = new LaneSpace()
    const deck: IDeckState = generateDeckState({
      regular: {
        [queen.id]: queen,
        [jack.id]: jack
      },
      foundations: {},
      tableau: {
        [space.id]: space
      },
      unrevealedCount: 0
    })
    const move = new Pair(queen.id, jack.id)

    expect(isWinningMove(move, deck)).toEqual(false)
  })

  it('should return false if there is no card being moved', () => {
    const deck: IDeckState = generateDeckState({
      regular: {},
      foundations: {},
      tableau: {},
      unrevealedCount: 0
    })
    const move = new Pair()

    expect(isWinningMove(move, deck)).toEqual(false)
  })
})
