import { Card } from '@/types/Card'
import { State } from '@/store/state'

export const generateDeckState = (regular: Record<string, Card>): State => ({
  cards: regular,
  tableau: {},
  foundations: {},
  waste: [],
  stock: [],
} as unknown as State)

