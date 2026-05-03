import { Card } from '@/types/Card'
import { State } from '@/store/state'
import { IHint } from '@/interfaces/IHint'
import { getDealableCards } from '@/utils/getDealableCards'
import { getMoveableCardHints } from './getMoveableCardHints'

/**
 * Returns a list containing a single hint to highlight the dealing card, if a playable card
 * is buried in the stock or waste. If none found, returns an empty list.
 *
 * @param {Card[]} allCards - all cards in the game
 * @param {Card[]} playableCards - cards that can be moved around by the user
 * @param { type State } gameState - current state of the deck
 * @returns {string[][]} list of hint pairs
 */
export const getDeckHints: IHint = (state: State, playableCards: Card[]): string[][] => {
  const dealableCards: Card[] = getDealableCards(state)

  if (dealableCards.length === 0) return []

  const hints: string[][] = getMoveableCardHints(state, playableCards.concat(dealableCards), true)

  return hints.length > 0
    ? [['DEAL_CARD']]
    : []
}
