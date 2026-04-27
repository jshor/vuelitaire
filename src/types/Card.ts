import type { ICard } from '@/interfaces/ICard'

export type Card = ICard & {
  id: string
  hasError: boolean
}
