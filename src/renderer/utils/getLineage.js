/**
 * Generates a list of all descendants of the given card, including itself.
 *
 * @param {Card} card
 * @returns {Card[]}
 */
export default function getLineage (card) {
  const findChildren = cards => {
    const last = cards[cards.length - 1]

    if (last.child) {
      return findChildren(cards.concat(last.child))
    }
    return cards
  }
  return findChildren([card])
}
