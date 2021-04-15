import IDeckState from '@/interfaces/IDeckState'
import Pair from '@/models/Pair'

/**
 * Computes points to deduct for reversing a card move.
 *
 * @private
 * @param {ICard} card
 * @param {ICard} target
 * @returns {number} negative points
 */
function getPointsFromUndo (card, target): number {
  if (!target) {
    // no target: the card is being returned to the waste (i.e., via undo)

    if (card.promoted) {
      // the card is being returned to the waste from the foundation
      return -10
    } else if (!card.parent) {
      // the card is being returned to the waste from the tableaux
      return -5
    }
  } else if (!target.revealed) {
    // the card is being returned to its previous parent
    return -3
  } else if (card.promoted) {
    // the card is being returned to the tableaux from the foundation
    return -15
  }

  return 0
}

/**
 * Computes the points to award for playing a card.
 *
 * @private
 * @param {ICard} card
 * @param {ICard} target
 * @returns {number} negative points
 */
function getPointsFromPlay (card, target): number {
  if (target.promoted) {
    // 10 points for each card moved to a foundation pile

    if (card.parent && !card.parent.revealed) {
      // +5 points for the parent that will be revealed from this move
      return 15
    }

    return 10
  } else if (!card.parent) {
    // 5 points for each card moved from the deck to the tableaux.
    return 5
  }

  return 0
}

/**
 * Computes the points (positive or negative) to accrue for the given move.
 *
 * @param {Pair} move
 * @param {IDeckState} deckState
 * @returns {number} points
 */
export default function cardMove (move: Pair, deckState: IDeckState): number {
  const getCard = (id) => deckState.cards.regular[id]
    || deckState.cards.foundations[id]
    || deckState.cards.tableau[id]
  const card = getCard(move.cardId)
  const target = getCard(move.targetId)

  if (!card) {
    return 0
  }
  return getPointsFromUndo(card, target) || getPointsFromPlay(card, target)
}
