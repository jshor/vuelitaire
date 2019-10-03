import { Suits } from '../../constants'

export default function hasAlternatingColor (parent, child) {
  const isRed = s => [Suits.DIAMONDS, Suits.HEARTS].includes(s)
  const isBlack = s => [Suits.CLUBS, Suits.SPADES].includes(s)

  return isBlack(parent.suit)
    ? isRed(child.suit)
    : isBlack(child.suit)
}
