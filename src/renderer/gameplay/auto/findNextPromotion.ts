import ICard from '../../interfaces/ICard'
import IDeckState from '../../interfaces/IDeckState'
import FoundationSpace from '../../models/FoundationSpace'
import LaneSpace from '../../models/LaneSpace'
import Pair from '../../models/Pair'
import getLineage from '../../utils/getLineage'

export default function findNextPromotion ({ cards, waste }: IDeckState): Pair {
  const moveableCards: ICard[] = []
  const foundations: ICard[] = []

  Object
    .values(cards)
    .forEach((card: ICard): void => {
      if (card instanceof LaneSpace) {
        moveableCards.push(getLineage(card).pop())
      }
      if (card instanceof FoundationSpace) {
        foundations.push(getLineage(card).pop())
      }
    })

  if (waste.length) {
    moveableCards.push(waste[0])
  }

  for (const i in moveableCards) {
    const target: ICard = foundations.find((c: ICard): boolean => {
      return c.canAcceptCard(moveableCards[i])
    })

    if (target) {
      return new Pair(moveableCards[i].id, target.id)
    }
  }
  return null
}
