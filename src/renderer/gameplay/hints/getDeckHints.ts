import getDealableCards from '../../utils/getDealableCards'
import getMoveableCardHints from './getMoveableCardHints'
import ICard from '../../interfaces/ICard'
import IHint from '../../interfaces/IHint'
import IDeckState from '../../interfaces/IDeckState'

const getDeckHints: IHint = (allCards: ICard[], playableCards: ICard[], deckState: IDeckState): string[][] => {
  const dealableCards: ICard[] = getDealableCards(deckState)
  const targetCards: ICard[]  = allCards.filter(card => !card.child)
  const hints: string[][] = getMoveableCardHints(targetCards, dealableCards, deckState, true)

  return hints.length > 0
    ? [['DEAL_CARD']]
    : []
}

export default getDeckHints
