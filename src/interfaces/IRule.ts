import { Card } from '@/types/Card'

export type IRule = (baseCard: Card, newCard?: Card) => boolean
