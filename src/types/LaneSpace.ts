import type { ICard } from '@/interfaces/ICard'
import type { IRule } from '@/interfaces/IRule'

export type LaneSpace = ICard & {
  index: number
  hasError: boolean
}
