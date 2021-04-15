import ICard from '@/interfaces/ICard'

/**
 * Generates a list of all descendants of the given card, including itself.
 *
 * @param {ICard} card
 * @returns {ICard[]} list of descendants
 */
export default function getLineage (card: ICard): ICard[] {
  const findChildren = (cards: ICard[]): ICard[] => {
    const last: ICard = cards[cards.length - 1]

    if (last.child) {
      return findChildren(cards.concat(last.child))
    }
    return cards
  }
  return findChildren([card])
}
