import { IHint } from '@/interfaces/IHint'
import { State } from '@/store/state'
import { Card } from '@/types/Card'

/**
 * Returns a list of all hints where a king can be moved onto an empty `LaneSpace`
 *
 * @param {ICard[]} allCards - all cards in the game
 * @param {ICard[]} playableCards - cards that can be moved around by the user
 * @param {IDeckState} deckState - current state of the deck
 * @returns {string[][]} list of hint pairs
 */
export const getLaneCreationHints: IHint = (allCards: Card[], playableCards: Card[], deckState: State): string[][] => {
  const openSpaces = (Object
    .values(deckState.tableau) as Card[])
    .filter((card: Card): boolean => !card.child)
  const availableKings = playableCards.filter((card: Card): boolean => {
    return card.rank === 12 && !card.child
  })

  return openSpaces.reduce((entries: string[][], space: Card): string[][] => [
    ...entries,
    ...availableKings.map((king) => [king.id, space.id])
  ], [])
}

export default getLaneCreationHints
