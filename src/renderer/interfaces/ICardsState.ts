import ICardsMap from './ICardsMap'
import ICard from './ICard';

export default interface ICardsState {
  foundations: ICardsMap<ICard>,
  tableau: ICardsMap<ICard>,
  regular: ICardsMap<ICard>
}
