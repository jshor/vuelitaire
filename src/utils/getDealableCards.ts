import { DEALT_CARDS_DISPLAYED } from '@/constants'
import { ICard } from '@/interfaces/ICard'
import { State } from '@/store/state'

/**
 * Computes all cards that, at the time of computation, can be moved from the deck to the tableaux.
 *
 * @note This does not compute any card rules, only whether or not the card's index is numerically viable for a deal.
 *
 * @param {Object} deck - deck vuex store module
 * @param {Card[]} deck.stock - list of cards in the stock pile
 * @param {Number} deck.dealCount - number of cards to be dealt at a time (1 or 3)
 * @returns {Card[]}
 */
export function getDealableCards ({ stock, settings, dealIndex, dealSpace }: State) {
  // list of cards from the dealt pile which are "stuck" under other cards
  const unmoveableStockCards = stock
    // the top `DEALT_CARDS_DISPLAYED` cards from the stock are "stuck" under the top-most dealt card
    .slice(dealIndex, DEALT_CARDS_DISPLAYED + dealIndex)
    // allow the top-most dealt card to be moved
    .filter(card => card.id !== dealSpace.child?.id)

  const deckCards: ICard[] = [...stock]
    .reverse()
    .filter(card => !unmoveableStockCards.some(c => c.id === card.id))

  return deckCards.filter((c: ICard, index: number): boolean => {
    return (index + settings.dealCount + 1) % settings.dealCount === 0 || index === deckCards.length - 1
  })
}
