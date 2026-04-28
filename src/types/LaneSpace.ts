import type { ICard } from '@/interfaces/ICard'

export type LaneSpace = ICard & {
  index: number
  hasError: boolean
}
