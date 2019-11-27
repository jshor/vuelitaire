import getLineage from '../../utils/getLineage'
import getDealableCards from '../../utils/getDealableCards'
import hasAlternatingColor from '../rules/hasAlternatingColor'
import FoundationSpace from '../../models/FoundationSpace'
import LaneSpace from '../../models/LaneSpace'
import ICard from '../../interfaces/ICard'
import IHint from '../../interfaces/IHint'
import IDeckState from '../../interfaces/IDeckState'

/**
 * Finds all promoted cards that, when worried back, will allow the playing of an untouched card.
 *
 * @param {Card[]} cards
 * @param {Object} deck
 * @returns {String[][]}
 */
const getWorryBackHints: IHint = (allCards: ICard[], playableCards: ICard[], deckState: IDeckState): string[][] => {
  // compute all tableaux top cards that haven't been touched by the user yet
  const untouchedTopCards = allCards
    .filter(card => card instanceof LaneSpace)
    .map(card => getLineage(card).slice(-2).shift()) // get the second-to-last card
    .filter(card => !card.revealed || card instanceof LaneSpace)
    .map(card => card.child)
    .filter(card => card)

  // get all cards that can be used for moving
  const moveableCards = getDealableCards(deckState).concat(untouchedTopCards)

  const promotedCards = allCards
    // start with finding the Foundation spaces
    .filter(card => card instanceof FoundationSpace)
    // then get the top (visible) card of each foundation pile
    .map(card => getLineage(card).pop())

  /**
   * Determines if card A is one rank below card B.
   *
   * @private
   * @param {ICard} a
   * @param {ICard} a
   */
  const isRanking = (a: ICard, b: ICard): boolean => a.rank === b.rank + 1

  return promotedCards
    // find all promoted cards for which this rule will apply to
    .filter((promotedCard: ICard) => {
      return moveableCards.find(moveableCard => {
        return hasAlternatingColor(promotedCard, moveableCard) && isRanking(moveableCard, promotedCard)
      })
    })
    .map(promotedCard => [
      promotedCard,
      untouchedTopCards
        .find((card) => {
          // find top cards that can accept this promoted card
          return hasAlternatingColor(card, promotedCard) && isRanking(card, promotedCard)
        })
    ])
    // filter out non-results
    .filter(([card, target]) => card && target)
    .map(([card, target]) => [card.id, target.id])
}

export default getWorryBackHints
