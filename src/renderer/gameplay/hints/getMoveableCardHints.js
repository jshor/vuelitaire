export default function getMoveableCardHints (cards, topWasteCard) {
  const playableCards = cards.filter(card => card.isPlayable())
  const moveableCards = playableCards
    .concat(topWasteCard) // TODO: filter out promoted cards

  return playableCards.reduce((hints, target) => [
    ...hints,
    ...moveableCards
      // for each card, check if the target card can accept the moveable one
      .filter(card => target.canAcceptCard(card))
      .map(card => [card.id, target.id])
  ], [])
}
