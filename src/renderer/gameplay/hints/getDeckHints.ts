import getDealableCards from '../../utils/getDealableCards'
import getMoveableCardHints from './getMoveableCardHints'
import ICard from '../../types/interfaces/ICard'
import IHint from '../IHint'
import { DeckState } from '../../store/modules/deck'

const getDeckHints: IHint = (allCards: ICard[], playableCards: ICard[], deckState: DeckState): string[][] => {
  const dealableCards: ICard[] = getDealableCards(deckState)
  const targetCards: ICard[]  = allCards.filter(card => !card.child)
  const hints: string[][] = getMoveableCardHints(targetCards, dealableCards, deckState, true)

  return hints.length > 0
    ? [['DEAL_CARD']]
    : []
}

export default getDeckHints
