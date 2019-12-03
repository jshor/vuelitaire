import IDeckState from '@/interfaces/IDeckState'

/**
 * Computes the point deduction for the given deal move, based on the deal count.
 *
 * @param deckState
 * @returns {number} negative point deduction
 */
export default function dealDeduction (deckState: IDeckState): number {
  if (deckState.dealt.length > 0) {
    // we haven't reached the end of the deck yet, so don't deduct points
    return 0
  }

  if (deckState.dealCount === 3) {
    // -20 points for each pass through the deck after four passes (Draw Three option).
    return -20
  }
  // -100 points for each pass through the deck after one pass (Draw One option).
  return -100
}
