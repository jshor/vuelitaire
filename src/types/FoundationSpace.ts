import type { ICard } from '@/interfaces/ICard'

export type FoundationSpace = ICard & {
  type: 'FoundationSpace'
  index: number
  hasError: boolean
}
