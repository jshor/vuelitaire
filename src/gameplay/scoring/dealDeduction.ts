import { State } from '@/store/state'
import { getLineage } from '@/utils/getLineage'

/**
 * Computes the point deduction for the given deal move, based on the deal count.
 *
 * @param { type State } gameState
 * @returns {number} negative point deduction
 */
export function dealDeduction (gameState: State): number {
  if ((gameState.waste.length + gameState.stock.length) === 0) {
    // no cards left, so don't deduct any points
    return 0
  }

  if (getLineage(gameState.dealSpace.child).length > 0) {
    // we haven't reached the end of the deck yet, so don't deduct points
    return 0
  }

  if (gameState.settings.dealCount === 3) {
    // -20 points for each pass through the deck after four passes (Draw Three option).
    return -20
  }
  // -100 points for each pass through the deck after one pass (Draw One option).
  return -100
}
