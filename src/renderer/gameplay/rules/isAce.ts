
import IRule from '../../interfaces/IRule'
import ICard from '../../interfaces/ICard'

const isAce: IRule = (parent: ICard, child: ICard): boolean => {
  return child.rank === 0
}

export default isAce
