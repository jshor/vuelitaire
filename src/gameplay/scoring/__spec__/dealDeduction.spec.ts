import { Suits } from '@/constants'
import Card from '@/models/Card'
import dealDeduction from '../dealDeduction'
import generateDeckState from './__helpers__/generateDeckState'

describe('dealDeduction()', () => {
  it('should return 0 if there are still cards to deal', () => {
    const deckState = generateDeckState({})

    deckState.dealt = [new Card(Suits.DIAMONDS, 1)]

    expect(dealDeduction(deckState)).toEqual(0)
  })

  xit('should return -20 if there are no cards to deal and the dealCount is 3', () => {
    const deckState = generateDeckState({})

    deckState.dealt = []
    deckState.dealCount = 3

    expect(dealDeduction(deckState)).toEqual(-20)
  })

  xit('should return -100 if there are no cards to deal and the dealCount is 1', () => {
    const deckState = generateDeckState({})

    deckState.dealt = []
    deckState.dealCount = 1

    expect(dealDeduction(deckState)).toEqual(-100)
  })
})
