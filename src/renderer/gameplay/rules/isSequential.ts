import IRule from '../IRule'
import ICard from '../../types/interfaces/ICard'

const isSequential: IRule = (parent: ICard, child: ICard): boolean => {
  const sequence = parent.promoted ? -1 : 1

  return parent.rank === child.rank + sequence
}

export default isSequential
