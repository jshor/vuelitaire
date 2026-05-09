import { getDeckHints } from '@/gameplay/hints/getDeckHints'
import { getDestructuringLaneHints } from '@/gameplay/hints/getDestructuringLaneHints'
import { getLaneCreationHints } from '@/gameplay/hints/getLaneCreationHints'
import { getMoveableCardHints } from '@/gameplay/hints/getMoveableCardHints'
import { getWorryBackHints } from '@/gameplay/hints/getWorryBackHints'
import { Card } from '@/types/Card'
import { State } from '@/store/state'

export function generateHints (deck: State): string[][] {
  const allCards: Card[] = Object
    .values(deck.cards)
    .filter(card => !deck.stock.includes(card)) // exclude cards in the stock, since those aren't actually "playable"
    .concat(deck.dealSpace.child || []) // include the currently-dealt card, if there is one

  const playableCards: Card[] = allCards.filter((card) => card.parent && !card.promoted)

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
