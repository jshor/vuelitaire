import getDeckHints from '@/gameplay/hints/getDeckHints'
import getDestructuringLaneHints from '@/gameplay/hints/getDestructuringLaneHints'
import getLaneCreationHints from '@/gameplay/hints/getLaneCreationHints'
import getMoveableCardHints from '@/gameplay/hints/getMoveableCardHints'
import getWorryBackHints from '@/gameplay/hints/getWorryBackHints'
import ICard from '@/interfaces/ICard'
import ICardsState from '@/interfaces/ICardsState'
import IDeckState from '@/interfaces/IDeckState'

export default function generateHints (deck: IDeckState): string[][] {
  const { cards, waste }: {
    cards: ICardsState,
    waste: ICard[]
  } = deck
  const allCards: ICard[] = Object
    .values(cards.regular)
    .concat(Object.values(cards.foundations))
    .concat(Object.values(cards.tableau))
  const playableCards: ICard[] = allCards
    .filter((card) => card.parent && !card.promoted)
    .concat(waste.slice(-1))

  // generate basic hints
  let hints: string[][] = [
    ...getMoveableCardHints(allCards, playableCards, deck),
    ...getLaneCreationHints(allCards, playableCards, deck),
    ...getDeckHints(allCards, playableCards, deck)
  ]

  // if there were no hints available, try the "desperate" hints
  if (hints.length === 0) {
    hints = hints.concat(getDestructuringLaneHints(allCards, playableCards, deck))
    hints = hints.concat(getWorryBackHints(allCards, playableCards, deck))
  }

  return hints
}
