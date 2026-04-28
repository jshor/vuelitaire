import { Suits } from '@/constants'
import { createCard } from '@/models/Card'
import { dealDeduction } from '../dealDeduction'
import { generateDeckState } from './__helpers__/generateDeckState'

describe('dealDeduction()', () => {
  it('should return 0 if there are still cards to deal', () => {
    const gameState = generateDeckState({})

    gameState.dealSpace = createCard({ suit: Suits.DIAMONDS, rank: 1 })

    expect(dealDeduction(gameState)).toEqual(0)
  })
})
