import ICard from '@/interfaces/ICard'
import IDeckState from '@/interfaces/IDeckState'
import Pair from '@/models/Pair'
import getLineage from '@/utils/getLineage'

export default function findNextMove ({ cards }: IDeckState, child: ICard): Pair {
  const target: ICard = Object
    .values(cards.tableau)
    .concat(Object.values(cards.foundations))
    .sort((target: ICard) => target.promoted ? -1 : 1)
    .map((target: ICard) => getLineage(target).pop())
    .find((target: ICard): boolean => target.canAcceptCard(child))

  if (target) {
    return new Pair(child.id, target.id)
  }
  return null
}
