import ICard from '../../interfaces/ICard'
import IDeckState from '../../interfaces/IDeckState'
import IHint from '../../interfaces/IHint'
import getDealableCards from '../../utils/getDealableCards'
import getMoveableCardHints from './getMoveableCardHints'

/**
 * Returns a list containing a single hint to highlight the dealing card, if a playable card
 * is buried in the stock or waste. If none found, returns an empty list.
 *
 * @param {ICard[]} allCards - all cards in the game
 * @param {ICard[]} playableCards - cards that can be moved around by the user
 * @param {IDeckState} deckState - current state of the deck
 * @returns {string[][]} list of hint pairs
 */
const getDeckHints: IHint = (allCards: ICard[], playableCards: ICard[], deckState: IDeckState): string[][] => {
  const dealableCards: ICard[] = getDealableCards(deckState)
  const targetCards: ICard[]  = allCards.filter((card) => !card.child)
  const hints: string[][] = getMoveableCardHints(targetCards, dealableCards, deckState, true)

  return hints.length > 0
    ? [['DEAL_CARD']]
    : []
}

export default getDeckHints
