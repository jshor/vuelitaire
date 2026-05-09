import { IHint } from '@/interfaces/IHint'
import { State } from '@/store/state'
import { Card } from '@/types/Card'
import getMoveableCardHints from './getMoveableCardHints'
import { getDealableCards } from '@/utils/getDealableCards'
import { DEAL_CARD_ID } from '@/constants'

/**
 * Returns a list containing a single hint to highlight the dealing card, if a playable card
 * is buried in the stock or waste. If none found, returns an empty list.
 *
 * @param {Card[]} allCards - all cards in the game
 * @param {Card[]} playableCards - cards that can be moved around by the user
 * @param {IDeckState} deckState - current state of the deck
 * @returns {string[][]} list of hint pairs
 */
export const getDeckHints: IHint = (allCards: Card[], playableCards: Card[], deckState: State): string[][] => {
  const dealableCards: Card[] = getDealableCards(deckState)
  const targetCards: Card[]  = allCards.filter((card) => !card.child)
  const hints: string[][] = getMoveableCardHints(targetCards, dealableCards, deckState, true)

  return hints.length > 0
    ? [[DEAL_CARD_ID]]
    : []
}

export default getDeckHints
