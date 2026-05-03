import { type Card } from '@/types/Card'

/**
 * Generates a list of all descendants of the given card, including itself.
 *
 * @param {Card} card
 * @returns {Card[]} list of descendants
 */
export function getLineage (card?: Card): Card[] {
  const findChildren = (cards: Card[]): Card[] => {
    const last: Card = cards[cards.length - 1]

    if (last.child) {
      return findChildren(cards.concat(last.child as Card))
    }
    return cards
  }

  if (card) {
    return findChildren([card])
  }

  return []
}
