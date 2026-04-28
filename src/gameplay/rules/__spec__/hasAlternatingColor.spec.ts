import { Suits } from '@/constants'
import { Card } from '@/types/Card'
import { createCard } from '@/models/Card'
import { hasAlternatingColor } from '../hasAlternatingColor'

describe('Rule: hasAlternatingColor', () => {
  function testRule (parentSuit: string, childSuit: string, value: boolean) {
    it(`should return true if the child card's suit is ${parentSuit} and the parent's suit is ${childSuit}`, () => {
      const parent: Card = createCard({ suit: parentSuit })
      const child: Card = createCard({ suit: childSuit })

      expect(hasAlternatingColor(parent, child)).toEqual(value)
    })
  }

  testRule(Suits.DIAMONDS, Suits.DIAMONDS, false)
  testRule(Suits.DIAMONDS, Suits.HEARTS, false)
  testRule(Suits.DIAMONDS, Suits.SPADES, true)
  testRule(Suits.DIAMONDS, Suits.CLUBS, true)

  testRule(Suits.HEARTS, Suits.DIAMONDS, false)
  testRule(Suits.HEARTS, Suits.HEARTS, false)
  testRule(Suits.HEARTS, Suits.SPADES, true)
  testRule(Suits.HEARTS, Suits.CLUBS, true)

  testRule(Suits.SPADES, Suits.DIAMONDS, true)
  testRule(Suits.SPADES, Suits.HEARTS, true)
  testRule(Suits.SPADES, Suits.SPADES, false)
  testRule(Suits.SPADES, Suits.CLUBS, false)

  testRule(Suits.CLUBS, Suits.DIAMONDS, true)
  testRule(Suits.CLUBS, Suits.HEARTS, true)
  testRule(Suits.CLUBS, Suits.SPADES, false)
  testRule(Suits.CLUBS, Suits.CLUBS, false)
})
