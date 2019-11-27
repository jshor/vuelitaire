import IDeckState from '../../../../interfaces/IDeckState'

const createDeckState = (): IDeckState => ({
  cards: {},
  move: null,
  stock: [], // cards in the stock pile
  waste: [], // the pile of cards dealt
  dealt: [], // the last `dealCount` (or fewer) cards dealt
  dealCount: 1 // number of cards to deal at a time
})

export default createDeckState
