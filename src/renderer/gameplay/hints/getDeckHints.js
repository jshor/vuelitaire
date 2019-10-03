import getDealableCards from '../../utils/getDealableCards'
import getMoveableCardHints from './getMoveableCardHints'

export default function getDeckHints (cards, deck) {
  const dealableCards = getDealableCards(deck)
  const targetCards = cards.filter(card => !card.child)
  const hints = getMoveableCardHints(targetCards, dealableCards, true)

  return hints.length > 0
    ? ['DEAL_CARD']
    : []
}
