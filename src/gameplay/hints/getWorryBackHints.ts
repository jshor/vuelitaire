import { hasAlternatingColor } from '@/gameplay/rules/hasAlternatingColor'
import { IHint } from '@/interfaces/IHint'
import { State } from '@/store/state'
import { Card } from '@/types/Card'
import { getDealableCards } from '@/utils/getDealableCards'
import { getLineage } from '@/utils/getLineage'

/**
 * Finds all promoted cards that, when moved, will allow the playing of an untouched card.
 *
 * @param {ICard[]} allCards - all cards in the game
 * @param {ICard[]} playableCards - cards that can be moved around by the user
 * @param {IDeckState} deckState - current state of the deck
 * @returns {string[][]} list of hint pairs
 */
export const getWorryBackHints: IHint = (allCards: Card[], playableCards: Card[], deckState: State): string[][] => {
  const tableauCards = Object.values(deckState.tableau) as Card[]
  // compute all tableaux top cards that haven't been touched by the user yet
  const untouchedTopCards = tableauCards
    .map((card) => getLineage(card).slice(-2).shift() || [] as Card[]) // get the second-to-last card
    .flat()
    .filter((card) => !card.revealed || card.type === 'LaneSpace')
    .map((card) => card.child)
    .filter((card) => card) as Card[]

  // get all cards that can be used for moving
  const moveableCards = getDealableCards(deckState).concat(untouchedTopCards)

  const promotedCards = (Object
    // start with finding the Foundation spaces
    .values(deckState.foundations) as Card[])
    // then get the top (visible) card of each foundation pile
    .map((card) => getLineage(card).pop())

  /**
   * Determines if card A is one rank below card B.
   *
   * @private
   * @param {ICard} a
   * @param {ICard} a
   */
  const isRanking = (a: Card, b: Card): boolean => a.rank === b.rank + 1

  return promotedCards
    // find all promoted cards for which this rule will apply to
    .filter((promotedCard) => {
      if (!promotedCard) return false
      return moveableCards.find((moveableCard) => {
        return hasAlternatingColor(promotedCard, moveableCard) && isRanking(moveableCard, promotedCard)
      })
    })
    .map((promotedCard) => [
      promotedCard,
      untouchedTopCards
        .filter(promotedCard => !!promotedCard)
        .find((card) => {
          // find top cards that can accept this promoted card
          return hasAlternatingColor(card, promotedCard) && isRanking(card, promotedCard!)
        })
    ])
    // filter out non-results
    .filter(([card, target]) => card && target)
    .map(([card, target]) => [card!.id, target!.id])
}

export default getWorryBackHints
