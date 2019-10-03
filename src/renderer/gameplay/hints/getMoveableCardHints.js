export default function getMoveableCardHints (targets, potentialMovable, ignoreRank) {
  const potentialTargets = targets.filter(card => card.isPlayable())

  /**
   * Returns the parent card, or an empty object if child is an orphan.
   *
   * @private
   * @param {Card} child
   * @returns {Card|Object}
   */
  const getParentCard = child => targets.find(c => c.child === child && c.revealed) || {}

  return potentialTargets
    .reduce((hints, target) => [
      ...hints,
      ...potentialMovable
        // for each card, check if the target card can accept the moveable one
        .filter(card => target.canAcceptCard(card))
        // omit promotions (which cannot happen in tableau lanes),
        // a parent whose rank matches unless ranks are ignored
        .filter(card => getParentCard(card).rank !== target.rank || target.promoted || ignoreRank)
        .map(card => [card, target])
    ], [])
    .sort(([card, target]) => !target.promoted) // promotions should be displayed first
    .map(([card, target]) => [card.id, target.id])
}
