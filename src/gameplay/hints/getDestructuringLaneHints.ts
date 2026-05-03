import {Card} from '@/types/Card'
import { type State } from '@/store/state'
import {IHint} from '@/interfaces/IHint'
import {getLineage} from '@/utils/getLineage'

/**
 * Finds all moves where moving a card will allow its parent to be promoted.
 *
 * @param {Card[]} allCards - all cards in the game
 * @param {Card[]} playableCards - cards that can be moved around by the user
 * @param { type State } gameState - current state of the deck
 * @returns {string[][]} list of hint pairs
 */
export const getDestructuringLaneHints: IHint = (state: State, playableCards: Card[]): string[][] => {
  return Object
    // start with finding the Foundation spaces
    .values(state.foundations)
    // then get the top (visible) card of each foundation pile
    .map((card: Card) => getLineage(card).pop())
    // select the card with the next rank to be placed onto the top of each Foundation pile
    .map((card) => {
      return card && playableCards
        .find((c: Card): boolean => {
          return c.rank === card.rank + 1 && c.suit === card.suit
        })
    })
    // select its child
    .map((card) => card?.child)
    // find a card that it can be moved to
    .map((card) => [
      card,
      playableCards.find((c: Card): boolean => c.canAcceptCard(card as Card | undefined))
    ])
    .map(([card, target]) => card && target && [card.id, target.id])
    .filter(list => !!list) as string[][]
}
