import { hasAlternatingColor } from '@/gameplay/rules/hasAlternatingColor'
import { Card } from '@/types/Card'
import { State } from '@/store/state'
import { IHint } from '@/interfaces/IHint'
import { getDealableCards } from '@/utils/getDealableCards'
import { getLineage } from '@/utils/getLineage'

/**
 * Finds all promoted cards that, when moved, will allow the playing of an untouched card.
 *
 * @param {Card[]} allCards - all cards in the game
 * @param {Card[]} playableCards - cards that can be moved around by the user
 * @param { type State } gameState - current state of the deck
 * @returns {string[][]} list of hint pairs
 */
export const getWorryBackHints: IHint = (state: State): string[][] => {
  // compute all tableaux top cards that haven't been touched by the user yet
  const untouchedTopCards = Object
    .values(state.tableau)
    .map((card) => getLineage(card).slice(-2).shift()) // get the second-to-last card
    .filter((card) => !card?.revealed || card?.type === 'LaneSpace')
    .map((card) => card?.child)
    .filter((card) => !!card) as Card[]

  // get all cards that can be used for moving
  const moveableCards = getDealableCards(state).concat(untouchedTopCards)

  const promotedCards = Object
    // start with finding the Foundation spaces
    .values(state.foundations)
    // then get the top (visible) card of each foundation pile
    .map((card) => getLineage(card).pop())

  /**
   * Determines if card A is one rank below card B.
   *
   * @private
   * @param {Card} a
   * @param {Card} a
   */
  const isRanking = (a: Card, b: Card): boolean => a.rank === b.rank + 1

  return promotedCards
    // find all promoted cards for which this rule will apply to
    .filter((promotedCard) => {
      return moveableCards.find((moveableCard) => {
        return promotedCard && hasAlternatingColor(promotedCard, moveableCard) && isRanking(moveableCard, promotedCard)
      })
    })
    .map((promotedCard) => [
      promotedCard,
      untouchedTopCards
        .find((card) => {
          // find top cards that can accept this promoted card
          return promotedCard && card && hasAlternatingColor(card, promotedCard) && isRanking(card, promotedCard)
        })
    ])
    .map(([card, target]) => [card?.id, target?.id])
    // filter out non-results
    .filter(([card, target]) => card && target) as string[][]
}

