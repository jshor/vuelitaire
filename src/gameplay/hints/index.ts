import { DEALT_CARDS_DISPLAYED } from '@/constants'
import { getDeckHints } from '@/gameplay/hints/getDeckHints'
import { getDestructuringLaneHints } from '@/gameplay/hints/getDestructuringLaneHints'
import { getLaneCreationHints } from '@/gameplay/hints/getLaneCreationHints'
import { getMoveableCardHints } from '@/gameplay/hints/getMoveableCardHints'
import { getWorryBackHints } from '@/gameplay/hints/getWorryBackHints'
import { ICard } from '@/interfaces/ICard'
import { State } from '@/store/state'
import { getLineage } from '@/utils/getLineage'

export function generateHints (state: State, allowWorryBackHints = false): string[][] {
  // list of cards from the dealt pile which are "stuck" under other cards
  const unmoveableStockCards = state
    .stock
    // the top `DEALT_CARDS_DISPLAYED` cards from the stock are "stuck" under the top-most dealt card
    .slice(state.dealIndex, DEALT_CARDS_DISPLAYED + state.dealIndex)
    // allow the top-most dealt card to be moved
    .filter(card => card.id !== state.dealSpace.child?.id)

  // all the cards that can be moved in the current state of the game
  const playableCards: ICard[] = Object
    .values(state.tableau)
    .map(getLineage)
    .flat()
    .filter(({ id }) => !unmoveableStockCards.some(card => card.id === id))

  if (state.dealSpace.child) {
    // add the top card of the dealt pile, if one
    playableCards.concat(state.dealSpace.child)
  }

  // generate basic hints
  let hints: string[][] = [
    ...getMoveableCardHints(state, playableCards),
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
