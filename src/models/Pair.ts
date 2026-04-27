export type { Pair } from '@/types/Pair'
import type { Pair } from '@/types/Pair'

export function createPair (cardId?: string, targetId?: string): Pair {
  return { cardId, targetId }
}
