import { isAce } from '@/gameplay/rules/isAce'
import { isBuildable } from '@/gameplay/rules/isBuildable'

export type { FoundationSpace } from '@/types/FoundationSpace'
import type { FoundationSpace } from '@/types/FoundationSpace'
import { createCard } from './Card'
import { hasSameSuitAfterPromotion } from '@/gameplay/rules/hasSameSuitAfterPromotion'

export function createFoundationSpace (suit: string): FoundationSpace {
  return {
    ...createCard({
      suit,
      promoted: true,
      revealed: true,
      rules: [isBuildable, isAce, hasSameSuitAfterPromotion]
    }),
    type: 'FoundationSpace'
  }
}
