
import IRule from '../IRule'
import ICard from '../../types/interfaces/ICard'

const isAce: IRule = (parent: ICard, child: ICard): boolean => {
  return child.rank === 0
}

export default isAce
