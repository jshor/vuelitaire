import LaneSpace from '../../models/LaneSpace'
import ICard from '../../interfaces/ICard'
import IDeckState from '../../interfaces/IDeckState'
import IHint from '../../interfaces/IHint'

const getLaneCreationHints: IHint = (allCards: ICard[], playableCards: ICard[], deckState: IDeckState): string[][] => {
  const openSpaces = allCards.filter((card: ICard): boolean => {
    return card instanceof LaneSpace && !card.child
  })
  const availableKings = playableCards.filter((card: ICard): boolean => {
    return card.rank === 12 && !card.child
  })

  return openSpaces.reduce((entries: string[][], space: ICard): string[][] => [
    ...entries,
    ...availableKings.map(king => [king.id, space.id])
  ], [])
}

export default getLaneCreationHints
