import ICard from '@/interfaces/ICard'
import IDeckState from '@/interfaces/IDeckState'
import Pair from '@/models/Pair'
import getLineage from '@/utils/getLineage'

export default function isWinningMove (move: Pair, deckState: IDeckState) {
  const card: ICard = deckState.cards.regular[move.cardId]

  if (card && card.rank === 12) {
    if (deckState.cards.regular[move.targetId]) {
      // the only ranked target a King can move onto is a Queen, which implies promotion
      // since only four of these moves exist, check here to see if the game is won
      // better to do this check as infrequently as it's computationally expensive to do
      const promotedCount: number = Object
        .values(deckState.cards.foundations)
        .reduce((count: number, foundation: ICard): number => {
          return count + getLineage(foundation).length - 1 // -1 to not count the FoundationSpace
        }, 0)

      // check if there are 52 promoted cards (standard count in a Solitaire deck)
      return promotedCount === 52 // TODO: make 52 a constant?
    }
  }
  return false
}
