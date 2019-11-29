import ICard from '../../interfaces/ICard'
import IDeckState from '../../interfaces/IDeckState'
import IHint from '../../interfaces/IHint'
import BaseCard from '../../models/BaseCard'

/**
 * Returns a list of all hints where a card can be moved onto another.
 *
 * @remarks This does not count moves where a King can be moved onto an empty `LaneSpace`.
 *
 * @param {ICard[]} allCards - all cards in the game
 * @param {ICard[]} playableCards - cards that can be moved around by the user
 * @param {IDeckState} deckState - current state of the deck
 * @param {boolean} ignoreRank - whether to ignore the rank of the card's current parent
 * @returns {string[][]} list of hint pairs
 */
const getMoveableCardHints: IHint = (
  allCards: ICard[],
  playableCards: ICard[],
  deckState: IDeckState,
  ignoreRank: boolean = false
): string[][] => {
  const potentialTargets = allCards.filter((card) => card.isPlayable())

  /**
   * Returns the parent card, or an empty object if child is an orphan.
   *
   * @private
   * @param {Card} child
   * @returns {boolean}
   */
  const hasRankingParent = (child: ICard, target: ICard): boolean => {
    const parent: ICard = allCards.find((c) => c.child === child && c.revealed)

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
    .sort(([card, target]: [ICard, ICard]): number => target.promoted ? 1 : -1) // promotions should be displayed first
    .map(([card, target]: [ICard, ICard]): string[] => [card.id, target.id])
}

export default getMoveableCardHints
