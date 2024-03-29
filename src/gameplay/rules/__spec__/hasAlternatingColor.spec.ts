import { Suits } from '@/constants'
import Card from '@/models/Card'
import hasAlternatingColor from '../hasAlternatingColor'

describe('Rule: hasAlternatingColor', () => {
  function testRule (parentSuit, childSuit, value) {
    it(`should return true if the child card's suit is ${parentSuit} and the parent's suit is ${childSuit}`, () => {
      const parent: Card = new Card(parentSuit, 0)
      const child: Card = new Card(childSuit, 0)

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
