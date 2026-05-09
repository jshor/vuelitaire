import { IHint } from '@/interfaces/IHint'
import { State } from '@/store/state'
import { Card } from '@/types/Card'

/**
 * Returns a list of all hints where a card can be moved onto another.
 *
 * @remarks This does not count moves where a King can be moved onto an empty `LaneSpace`.
 *
 * @param {Card[]} allCards - all cards in the game
 * @param {Card[]} playableCards - cards that can be moved around by the user
 * @param {IDeckState} deckState - current state of the deck
 * @param {boolean} ignoreRank - whether to ignore the rank of the card's current parent
 * @returns {string[][]} list of hint pairs
 */
export const getMoveableCardHints: IHint = (
  allCards: Card[],
  playableCards: Card[],
  deckState: State,
  ignoreRank: boolean = false
): string[][] => {
  const potentialTargets = allCards.filter((card) => card.revealed && (card.parent || card.type === 'FoundationSpace'))

  /**
   * Returns the parent card, or an empty object if child is an orphan.
   *
   * @private
   * @param {Card} child
   * @returns {boolean}
   */
  const hasRankingParent = (child: Card, target: Card): boolean => {
    const parent = allCards.find((c) => c.child === child && c.revealed)

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
    .sort(([_, target]: Card[]): number => target.promoted ? 1 : -1) // promotions should be displayed first
    .map(([card, target]: Card[]): string[] => [card.id, target.id])
}

export default getMoveableCardHints
