import getLineage from '../../utils/getLineage'

/**
 * Finds all moves where moving a card will allow its parent to be promoted.
 *
 * @param {Card[]} cards
 * @returns {String[][]}
 */
export default function getDestructuringLaneHints (cards) {
  return cards
    // start with finding the Foundation spaces
    .filter(card => card.constructor.name === 'FoundationSpace')
    // then get the top (visible) card of each foundation pile
    .map(card => getLineage(card).pop())
    // select the card with the next rank to be placed onto the top of each Foundation pile
    .map((card) => cards.find(c => c.rank === card.rank + 1 && c.suit === card.suit))
    // select its child
    .map(card => card && card.child)
    // ensure it exists
    .filter(card => card)
    // find a card that it can be moved to
    .map(card => [
      card,
      cards.find(c => c.canAcceptCard(card))
    ])
    // ensure the card and its target exist
    .filter(([card, target]) => card && target)
    .map(([card, target]) => [card.id, target.id])
}
