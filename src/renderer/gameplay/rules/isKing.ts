
import IRule from '../../interfaces/IRule'
import ICard from '../../interfaces/ICard'

const isKing: IRule = (parent: ICard, child: ICard): boolean => {
  return child.rank === 12
}

export default isKing
