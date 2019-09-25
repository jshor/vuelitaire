export default function getRevealableCardHints (cards) {
  return cards
    .filter(({ revealed, child, isPlayed }) => !revealed && !child && isPlayed)
    .map(({ id }) => [id])
}
