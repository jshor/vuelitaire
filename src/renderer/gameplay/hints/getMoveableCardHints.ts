import ICard from '../../types/interfaces/ICard'
import IHint from '../IHint'
import { DeckState } from '../../store/modules/deck'
import BaseCard from '../../models/BaseCard'

const getMoveableCardHints: IHint = (
  allCards: ICard[],
  playableCards: ICard[],
  deckState: DeckState,
  ignoreRank: boolean = false
): string[][] => {
  const potentialTargets = allCards.filter(card => card.isPlayable())

  /**
   * Returns the parent card, or an empty object if child is an orphan.
   *
   * @private
   * @param {Card} child
   * @returns {Card|Object}
   */
  const hasRankingParent = (child: ICard, target: ICard): boolean => {
    const parent: ICard = allCards.find(c => c.child === child && c.revealed)

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
