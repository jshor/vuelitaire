import getLineage from './getLineage'

/**
 * Asserts that the card having the given `targetId` is a descendant of `card`.
 *
 * @param {Card} card
 * @param {String} targetId
 * @returns {Boolean}
 */
export default function isDescendant (card, targetId) {
  return getLineage(card)
    .map(({ id }) => id)
    .includes(targetId)
}
