export default function getDealableCards ({ cards, waste, dealCount }) {
  const deckCards = [
    ...cards,
    ...waste.concat().reverse()
  ].reverse()

  return deckCards.filter((c, index) => {
    return (index + dealCount + 1) % dealCount === 0 || index === deckCards.length - 1
  })
}
