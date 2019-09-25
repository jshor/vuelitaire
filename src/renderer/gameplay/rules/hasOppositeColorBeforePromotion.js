import { Suits } from '../../constants'

export default function hasOppositeColorBeforePromotion (parent, child) {
  const b = s => [Suits.DIAMONDS, Suits.HEARTS].includes(s)
  const r = s => [Suits.CLUBS, Suits.SPADES].includes(s)

  if (b(parent.suit)) {
    return r(child.suit)
  }
  return b(child.suit)
}
