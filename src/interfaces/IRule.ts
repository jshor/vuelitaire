import { ICard } from './ICard'

export type IRule = (baseCard: ICard, newCard?: ICard) => boolean
