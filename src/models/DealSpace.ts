import { createCard } from './Card'
import { ICard } from '@/interfaces/ICard'

export function createDealSpace (): ICard {
  const space: ICard = {
    ...createCard(),
    type: 'DealSpace',
    revealed: true,
    rules: [() => false] // do not accept any cards
  }
  return space
}
