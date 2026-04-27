import { ICard } from '@/interfaces/ICard'
import { State } from '@/store/state'
import { IHint } from '@/interfaces/IHint'
import { getDealableCards } from '@/utils/getDealableCards'
import { getMoveableCardHints } from './getMoveableCardHints'

/**
 * Returns a list containing a single hint to highlight the dealing card, if a playable card
 * is buried in the stock or waste. If none found, returns an empty list.
 *
 * @param {ICard[]} allCards - all cards in the game
 * @param {ICard[]} playableCards - cards that can be moved around by the user
 * @param { type State } gameState - current state of the deck
 * @returns {string[][]} list of hint pairs
 */
export const getDeckHints: IHint = (allCards: ICard[], playableCards: ICard[], gameState: State): string[][] => {
  const dealableCards: ICard[] = getDealableCards(gameState)
  const targetCards: ICard[]  = allCards.filter((card) => !card.child)
  const hints: string[][] = getMoveableCardHints(targetCards, dealableCards, gameState, true)

  return hints.length > 0
    ? [['DEAL_CARD']]
    : []
}
