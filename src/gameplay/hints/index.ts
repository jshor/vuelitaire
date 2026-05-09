import { DEALT_CARDS_DISPLAYED } from '@/constants'
import { getDeckHints } from '@/gameplay/hints/getDeckHints'
import { getDestructuringLaneHints } from '@/gameplay/hints/getDestructuringLaneHints'
import { getLaneCreationHints } from '@/gameplay/hints/getLaneCreationHints'
import { getMoveableCardHints } from '@/gameplay/hints/getMoveableCardHints'
import { getWorryBackHints } from '@/gameplay/hints/getWorryBackHints'
import { Card } from '@/types/Card'
import { State } from '@/store/state'
import { getLineage } from '@/utils/getLineage'

export function generateHints (state: State, allowWorryBackHints = false): string[][] {
  // list of cards from the dealt pile which are "stuck" under other cards
  const immoveableStockCards = state
    .stock
    // the top `DEALT_CARDS_DISPLAYED` cards from the stock are "stuck" under the top-most dealt card
    .slice(state.dealIndex, DEALT_CARDS_DISPLAYED + state.dealIndex)

  // all the cards that can be moved in the current state of the game
  const playableCards: Card[] = Object
    // get the lineage of each card in the tableau, which will include any cards that can be moved by moving a parent card
    .values(state.tableau)
    .map(getLineage)
    .flat()
    .filter(({ id }) => !immoveableStockCards.some(card => card.id === id))
    // get the top cards of the foundations, including the foundation spaces themselves
    .concat(
      Object
        .values(state.foundations)
        .map(foundation => getLineage(foundation).pop() || [])
        .flat()
    )

  if (state.dealSpace.child) {
    // add the top card of the dealt pile, if one
    playableCards.push(state.dealSpace.child)
  }

  // generate basic hints
  let hints: string[][] = [
    ...getMoveableCardHints(state, playableCards, false),
    ...getLaneCreationHints(state, playableCards),
    ...getDeckHints(state, playableCards)
  ]

  // if there were no hints available, try the "desperate" hints
  if (hints.length === 0 || allowWorryBackHints) {
    hints = hints.concat(getDestructuringLaneHints(state, playableCards))
    hints = hints.concat(getWorryBackHints(state, playableCards))
  }

  return hints
}
