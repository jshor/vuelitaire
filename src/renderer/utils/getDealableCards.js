export default function getDealableCards ({ stock, waste, dealCount }) {
  const deckCards = [
    ...stock,
    ...waste.concat().reverse()
  ].reverse()

  return deckCards.filter((c, index) => {
    return (index + dealCount + 1) % dealCount === 0 || index === deckCards.length - 1
  })
}
