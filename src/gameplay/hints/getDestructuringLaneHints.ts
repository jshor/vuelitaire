import { IHint } from '@/interfaces/IHint'
import { State } from '@/store/state'
import { Card } from '@/types/Card'
import { getLineage } from '@/utils/getLineage'

/**
 * Finds all moves where moving a card will allow its parent to be promoted.
 *
 * @param {Card[]} allCards - all cards in the game
 * @param {Card[]} playableCards - cards that can be moved around by the user
 * @param {IDeckState} deckState - current state of the deck
 * @returns {string[][]} list of hint pairs
 */
export const getDestructuringLaneHints: IHint = (allCards: Card[], playableCards: Card[], deckState: State): string[][] => {
  return (Object
    // start with finding the Foundation spaces
    .values(deckState.foundations) as Card[])
    // then get the top (visible) card of each foundation pile
    .map((card) => getLineage(card).pop())
    // select the card with the next rank to be placed onto the top of each Foundation pile
    .map((card) => allCards.find((c): boolean => {
      return card ? c.rank === card.rank + 1 && c.suit === card.suit : false
    }))
    // select its child
    .map((card) => card?.child)
    // ensure it exists
    .filter((card): boolean => !!card)
    // find a card that it can be moved to
    .map((card) => [
      card,
      allCards.find((c) => c?.canAcceptCard(card))
    ])
    // ensure the card and its target exist
    .filter(([card, target]): boolean => !!card && !!target)
    // map the IDs for the hint
    .map(([card, target]): string[] => [card!.id, target!.id])
}

export default getDestructuringLaneHints
