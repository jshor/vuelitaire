import { getDeckHints } from '@/gameplay/hints/getDeckHints'
import { getDestructuringLaneHints } from '@/gameplay/hints/getDestructuringLaneHints'
import { getLaneCreationHints } from '@/gameplay/hints/getLaneCreationHints'
import { getMoveableCardHints } from '@/gameplay/hints/getMoveableCardHints'
import { getWorryBackHints } from '@/gameplay/hints/getWorryBackHints'
import { ICard } from '@/interfaces/ICard'
import { State } from '@/store/state'
import { getLineage } from '@/utils/getLineage'

export function generateHints (deck: State, allowWorryBackHints = false): string[][] {
  // list of cards from the dealt pile which are "stuck" under other cards
  const stuckCards = getLineage(deck.dealSpace)
    .slice(0, -1)
    .concat(
      Object
        .values(deck.tableau)
        .filter(({ revealed }) => !revealed)
    )

  // all the cards that can be moved in the current state of the game
  const allCards: ICard[] = Object
    .values(deck.cards)
    .filter(({ id }) => !stuckCards.some(card => card.id === id))

  // list of cards that can be moved without moving any other cards
  const playableCards: ICard[] = allCards.filter((card) => {
    return card.parent && !card.promoted && card.revealed && !stuckCards.some(c => c.id === card.id)
  })

  if (deck.dealSpace.child) {
    // add the top card of the dealt pile, if one
    const topCard = getLineage(deck.dealSpace.child).pop()

    if (topCard) {
      playableCards.concat(topCard)
    }
  }

  // generate basic hints
  let hints: string[][] = [
    ...getMoveableCardHints(allCards, playableCards, deck),
    ...getLaneCreationHints(allCards, playableCards, deck),
    ...getDeckHints(allCards, playableCards, deck)
  ]

  // if there were no hints available, try the "desperate" hints
  if (hints.length === 0 || allowWorryBackHints) {
    hints = hints.concat(getDestructuringLaneHints(allCards, playableCards, deck))
    hints = hints.concat(getWorryBackHints(allCards, playableCards, deck))
  }

  return hints
}
