import hasOppositeColorBeforePromotion from './hasOppositeColorBeforePromotion'
import Card from '../../store/models/Card'
import { Suits } from '../../constants'

describe('Rule: hasOppositeColorBeforePromotion', () => {
  function testRule (parentSuit, childSuit, value) {
    it(`should return true if the child card's suit is ${parentSuit} and the parent's suit is ${childSuit}`, () => {
      const parent = new Card(parentSuit)
      const child = new Card(childSuit)

      expect(hasOppositeColorBeforePromotion(parent, child)).toEqual(value)
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
