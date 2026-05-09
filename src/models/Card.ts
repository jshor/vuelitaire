import { v4 as uuid } from 'uuid'
import { hasAlternatingColorBeforePromotion } from '@/gameplay/rules/hasAlternatingColorBeforePromotion'
import { hasSameSuitAfterPromotion } from '@/gameplay/rules/hasSameSuitAfterPromotion'
import { isBuildable } from '@/gameplay/rules/isBuildable'
import { isSequential } from '@/gameplay/rules/isSequential'
import type { Card } from '@/types/Card'

export function createCard(defaultProps: Partial<Card> = {}): Card {
  const card: Card = {
    type: 'Card',
    id: uuid(),
    suit: '',
    rank: -1,
    child: undefined,
    parent: undefined,
    promoted: false,
    revealed: true,
    rules: [isBuildable, hasAlternatingColorBeforePromotion, hasSameSuitAfterPromotion, isSequential],

    canAcceptCard (target?: Card) {
      return this.rules.every(rule => Boolean(rule(this, target)))
    },

    toString() {
      return `${this.suit}${this.rank}${this.promoted ? ' (promoted)' : ''}`
    },

    ...defaultProps
  }

  return card
}
