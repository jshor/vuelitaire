export default function getDescendants (card) {
  const findChildren = cards => {
    const last = cards[cards.length - 1]

    if (last.child) {
      return findChildren(cards.concat(last.child))
    }
    return cards
  }
  return findChildren([card])
}
