/**
 * Asserts that the given child card container has `card` in one of its ancestral Vue components.
 *
 * @param {CardContainer} child - component to search
 * @param {Card} card - ancestor card to find
 * @returns {Boolean}
 */
export default function isAncestor (child, card) {
  while (child) {
    if (child.$props && child.$props.card) {
      if (child.$props.card.id === card.id) {
        return true
      }
    }
    child = child.$parent
  }
  return false
}
