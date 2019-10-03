import getLineage from './getLineage'

export default function isDescendant (card, targetId) {
  return getLineage(card)
    .map(({ id }) => id)
    .includes(targetId)
}
