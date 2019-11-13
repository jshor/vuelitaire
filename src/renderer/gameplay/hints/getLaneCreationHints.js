
export default function getLaneCreationHints (allCards, playableCards) {
  const openSpaces = allCards.filter(card => {
    return card.type === 'LaneSpace' && !card.child
  })
  const availableKings = playableCards.filter(card => card.rank === 12 && !card.child)

  return openSpaces.reduce((entries, space) => [
    ...entries,
    ...availableKings.map(king => [king.id, space.id])
  ], [])
}
