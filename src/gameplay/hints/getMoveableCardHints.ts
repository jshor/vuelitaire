import {Card} from '@/types/Card'
import { type State } from '@/store/state'
import {IHint} from '@/interfaces/IHint'

/**
 * Returns a list of all hints where a card can be moved onto another.
 *
 * @remarks This does not count moves where a King can be moved onto an empty `LaneSpace`.
 *
 * @param {Card[]} allCards - all cards in the game
 * @param {Card[]} playableCards - cards that can be moved around by the user
 * @param { type State } gameState - current state of the deck
 * @param {boolean} ignoreRank - whether to ignore the rank of the card's current parent
 * @returns {string[][]} list of hint pairs
 */
export const getMoveableCardHints: IHint = (state: State, playableCards: Card[], ignoreRank = false): string[][] => {
  const potentialTargets = playableCards.filter((card) => !card.child)

  /**
   * Returns the parent card, or an empty object if child is an orphan.
   *
   * @private
   * @param {Card} child
   * @returns {boolean}
   */
  const hasRankingParent = (child: Card, target: Card): boolean => {
    const parent = playableCards.find((c) => c.child === child)

    if (parent) {
      return parent.rank !== target.rank
    }
    return true
  }

  return potentialTargets
    .reduce((hints: Card[][], target: Card): Card[][] => [
      ...hints,
      ...playableCards
        // for each card, check if the target card can accept the moveable one
        .filter((card: Card): boolean => target.canAcceptCard(card))
        // omit promotions (which cannot happen in tableau lanes),
        // a parent whose rank matches unless ranks are ignored
        .filter((card: Card): boolean => hasRankingParent(card, target) || target.promoted || ignoreRank)
        .map((card: Card): [Card, Card] => [card, target])
    ], [])
    .sort(([_, target]): number => target?.promoted ? 1 : -1) // promotions should be displayed first
    .map(([card, target]): string[] => [card.id, target.id])
}

