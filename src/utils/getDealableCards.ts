import { ICard } from '@/interfaces/ICard'
import { State } from '@/store/state'

/**
 * Computes all cards that, at the time of computation, can be moved from the deck to the tableaux.
 *
 * @note This does not compute any card rules, only whether or not the card's index is numerically viable for a deal.
 *
 * @param {Object} deck - deck vuex store module
 * @param {Card[]} deck.stock - list of cards in the stock pile
 * @param {Card[]} deck.waste - list of cards in the waste pile
 * @param {Number} deck.dealCount - number of cards to be dealt at a time (1 or 3)
 * @returns {Card[]}
 */
export function getDealableCards ({ stock, waste, settings }: State) {
  const deckCards: ICard[] = [
    ...stock,
    ...waste.concat().reverse()
  ].reverse()

  return deckCards.filter((c: ICard, index: number): boolean => {
    return (index + settings.dealCount + 1) % settings.dealCount === 0 || index === deckCards.length - 1
  })
}
