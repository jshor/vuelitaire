import ICardsMap from '../../../../interfaces/ICardsMap'
import IDeckState from '../../../../interfaces/IDeckState'
import ICard from '../../../../interfaces/ICard'

const generateState = (regular: ICardsMap<ICard>): IDeckState => ({
  cards: {
    tableau: {},
    foundations: {},
    regular
  },
  move: null,
  waste: [],
  stock: [],
  dealt: [],
  dealCount: 1
})

export default generateState