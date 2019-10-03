import getLineage from '../../utils/getLineage'
import getDealableCards from '../../utils/getDealableCards'
import hasAlternatingColor from '../rules/hasAlternatingColor'

/**
 * Finds all promoted cards that, when worried back, will allow the playing of an untouched card.
 *
 * @param {Card[]} cards
 * @param {Object} deck
 * @returns {String[][]}
 */
export default function getWorryBackHints (cards, deck) {
  // compute all tableaux top cards that haven't been touched by the user yet
  const untouchedTopCards = cards
    .filter(card => card.constructor.name === 'LaneSpace')
    .map(card => getLineage(card).slice(-2).shift()) // get the second-to-last card
    .filter(card => !card.revealed || card.constructor.name === 'LaneSpace')
    .map(card => card.child)

  // get all cards that can be used for moving
  const moveableCards = getDealableCards(deck).concat(untouchedTopCards)

  const promotedCards = cards
    // start with finding the Foundation spaces
    .filter(card => card.constructor.name === 'FoundationSpace')
    // then get the top (visible) card of each foundation pile
    .map(card => getLineage(card).pop())

  const isRanking = (a, b) => a.rank === b.rank + 1

  return promotedCards
    // find all promoted cards for which this rule will apply to
    .filter(promotedCard => {
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
