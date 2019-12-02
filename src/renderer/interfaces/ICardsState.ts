import ICard from './ICard';
import ICardsMap from './ICardsMap'

export default interface ICardsState {
  foundations: ICardsMap<ICard>,
  tableau: ICardsMap<ICard>,
  regular: ICardsMap<ICard>
}
