import {ICard} from '@/interfaces/ICard'
import { type State } from '@/store/state'
import {IHint} from '@/interfaces/IHint'

/**
 * Returns a list of all hints where a card can be moved onto another.
 *
 * @remarks This does not count moves where a King can be moved onto an empty `LaneSpace`.
 *
 * @param {ICard[]} allCards - all cards in the game
 * @param {ICard[]} playableCards - cards that can be moved around by the user
 * @param { type State } gameState - current state of the deck
 * @param {boolean} ignoreRank - whether to ignore the rank of the card's current parent
 * @returns {string[][]} list of hint pairs
 */
export const getMoveableCardHints: IHint = (
  allCards: ICard[],
  playableCards: ICard[],
  gameState: State,
  ignoreRank = false
): string[][] => {
  const potentialTargets = allCards.filter((card) => card.revealed && !card.child)

  /**
   * Returns the parent card, or an empty object if child is an orphan.
   *
   * @private
   * @param {Card} child
   * @returns {boolean}
   */
  const hasRankingParent = (child: ICard, target: ICard): boolean => {
    const parent = allCards.find((c) => c.child === child && c.revealed)

    if (parent) {
      return parent.rank !== target.rank
    }
    return true
  }

  return potentialTargets
    .reduce((hints: ICard[][], target: ICard): ICard[][] => [
      ...hints,
      ...playableCards
        // for each card, check if the target card can accept the moveable one
        .filter((card: ICard): boolean => target.canAcceptCard(card))
        // omit promotions (which cannot happen in tableau lanes),
        // a parent whose rank matches unless ranks are ignored
        .filter((card: ICard): boolean => hasRankingParent(card, target) || target.promoted || ignoreRank)
        .map((card: ICard): [ICard, ICard] => [card, target])
    ], [])
    .sort(([_, target]): number => target?.promoted ? 1 : -1) // promotions should be displayed first
    .map(([card, target]): string[] => [card.id, target.id])
}

