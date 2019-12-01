import ICard from '../../interfaces/ICard'
import IDeckState from '../../interfaces/IDeckState'
import FoundationSpace from '../../models/FoundationSpace'
import LaneSpace from '../../models/LaneSpace'
import Pair from '../../models/Pair'
import getLineage from '../../utils/getLineage'

export default function findNextPromotion ({ cards, dealt }: IDeckState): Pair {
  const moveableCards: ICard[] = Object
    .values(cards.tableau)
    .map((card: ICard): ICard => getLineage(card).pop())
  const foundations: ICard[] = Object
    .values(cards.foundations)
    .map((card: ICard): ICard => getLineage(card).pop())

  if (dealt.length) {
    moveableCards.push(dealt.slice(-1).pop())
  }

  console.log('*************** FOUNDATIONS: ', foundations.length, moveableCards.length)

  for (const i in moveableCards) {
    const target: ICard = foundations.find((c: ICard): boolean => {
      console.log('CAN', c.toString(), ' ACCEPT ', moveableCards[i].toString(), c.canAcceptCard(moveableCards[i]))
      return c.canAcceptCard(moveableCards[i])
    })

    if (target) {
      return new Pair(moveableCards[i].id, target.id)
    }
  }
  return null
}
