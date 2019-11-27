import ICard from './ICard'

export default interface IRule {
  (parent: ICard, child: ICard): boolean
}
