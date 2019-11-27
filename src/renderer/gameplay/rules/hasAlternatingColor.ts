import { Suits } from '../../constants'
import IRule from '../../interfaces/IRule'
import ICard from '../../interfaces/ICard'

const hasAlternatingColor: IRule = (parent: ICard, child: ICard): boolean => {
  const isRed = (s: string): boolean => [Suits.DIAMONDS, Suits.HEARTS].includes(s)
  const isBlk = (s: string): boolean => [Suits.CLUBS, Suits.SPADES].includes(s)

  return isBlk(parent.suit)
    ? isRed(child.suit)
    : isBlk(child.suit)
}

export default hasAlternatingColor
