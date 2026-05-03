import {ICard} from '@/interfaces/ICard'
import { type State } from '@/store/state'
import {IHint} from '@/interfaces/IHint'

/**
 * Returns a list of all hints where a king can be moved onto an empty `LaneSpace`
 *
 * @param {ICard[]} allCards - all cards in the game
 * @param {ICard[]} playableCards - cards that can be moved around by the user
 * @param { type State } gameState - current state of the deck
 * @returns {string[][]} list of hint pairs
 */
export const getLaneCreationHints: IHint = (state: State, playableCards: ICard[]): string[][] => {
  const openSpaces = Object
    .values(state.tableau)
    .filter((card: ICard): boolean => !card.child)

  const availableKings = playableCards.filter((card: ICard): boolean => {
    return [
      card.rank === 12, // card is a king
      !card.child, // king has no children
      card.parent?.type !== 'LaneSpace' // king is not on top of an empty space already
    ].every(Boolean)
  })

  return openSpaces.reduce((entries: string[][], space: ICard): string[][] => [
    ...entries,
    ...availableKings.map((king) => [king.id, space.id])
  ], [])
}
