import IDeckState from '@/interfaces/IDeckState'

/**
 * Determines whether the user can autocomplete the game.
 *
 * @param {IDeckState} deckState
 * @returns {boolean}
 */
export default function canAutocomplete (deckState: IDeckState): boolean {
  if (deckState.cards.unrevealedCount === 0) {
    // all cards are revealed
    if (deckState.dealCount === 1) {
      // deal count is only one, making it possible to autocomplete
      return true
    }
    // check if number of cards remaining in the deck are less than or equal to two
    return (deckState.stock.length + deckState.waste.length) <= 2
  }
  return false
}
