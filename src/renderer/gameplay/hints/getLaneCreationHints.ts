import LaneSpace from '../../models/LaneSpace'
import ICard from '../../types/interfaces/ICard'
import IHint from '../IHint'
import { DeckState } from '../../store/modules/deck'

const getLaneCreationHints: IHint = (allCards: ICard[], playableCards: ICard[], deckState: DeckState): string[][] => {
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
