import ICard from '@/interfaces/ICard'
import IDeckState from '@/interfaces/IDeckState'
import IHint from '@/interfaces/IHint'
import getLineage from '@/utils/getLineage'

/**
 * Finds all moves where moving a card will allow its parent to be promoted.
 *
 * @param {ICard[]} allCards - all cards in the game
 * @param {ICard[]} playableCards - cards that can be moved around by the user
 * @param {IDeckState} deckState - current state of the deck
 * @returns {string[][]} list of hint pairs
 */
const getDestructuringLaneHints: IHint = (allCards: ICard[], p: ICard[], deckState: IDeckState): string[][] => {
  return Object
    // start with finding the Foundation spaces
    .values(deckState.cards.foundations)
    // then get the top (visible) card of each foundation pile
    .map((card: ICard): ICard => getLineage(card).pop())
    // select the card with the next rank to be placed onto the top of each Foundation pile
    .map((card: ICard): ICard => allCards.find((c: ICard): boolean => {
      return c.rank === card.rank + 1 && c.suit === card.suit
    }))
    // select its child
    .map((card: ICard): ICard => card && card.child)
    // ensure it exists
    .filter((card: ICard): boolean => !!card)
    // find a card that it can be moved to
    .map((card: ICard): [ICard, ICard] => [
      card,
      allCards.find((c: ICard): boolean => c.canAcceptCard(card))
    ])
    // ensure the card and its target exist
    .filter(([card, target]: [ICard, ICard]): boolean => !!card && !!target)
    .map(([card, target]: [ICard, ICard]): string[] => [card.id, target.id])
}

export default getDestructuringLaneHints
