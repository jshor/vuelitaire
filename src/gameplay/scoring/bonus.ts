/**
 * Computes bonus points based how many seconds it took to complete the game.
 *
 * @param {number} secondsElapsed
 * @returns {number} bonus points
 */
export default function bonus (secondsElapsed: number): number {
  if (secondsElapsed < 30) {
    // if the game takes less than 30 seconds, no bonus points are awarded
    return 0
  }

  return Math.ceil((20000 / secondsElapsed) * 35)
}
