
import IRule from '../IRule'
import ICard from '../../types/interfaces/ICard'

const isKing: IRule = (parent: ICard, child: ICard): boolean => {
  return child.rank === 12
}

export default isKing
