import ICard from '../types/interfaces/ICard'

export default interface IRule {
  (parent: ICard, child: ICard): boolean
}
