import getDescendants from './getDescendants'

export default function isDescendant (card, targetId) {
  return getDescendants(card)
    .map(({ id }) => id)
    .includes(targetId)
}
