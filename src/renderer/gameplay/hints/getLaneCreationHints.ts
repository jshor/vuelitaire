import ICard from '../../interfaces/ICard'
import IDeckState from '../../interfaces/IDeckState'
import IHint from '../../interfaces/IHint'

/**
 * Returns a list of all hints where a king can be moved onto an empty `LaneSpace`
 *
 * @param {ICard[]} allCards - all cards in the game
 * @param {ICard[]} playableCards - cards that can be moved around by the user
 * @param {IDeckState} deckState - current state of the deck
 * @returns {string[][]} list of hint pairs
 */
const getLaneCreationHints: IHint = (allCards: ICard[], playableCards: ICard[], deckState: IDeckState): string[][] => {
  const openSpaces = Object
    .values(deckState.cards.tableau)
    .filter((card: ICard): boolean => !card.child)
  const availableKings = playableCards.filter((card: ICard): boolean => {
    return card.rank === 12 && !card.child
  })

  return openSpaces.reduce((entries: string[][], space: ICard): string[][] => [
    ...entries,
    ...availableKings.map((king) => [king.id, space.id])
  ], [])
}

export default getLaneCreationHints
