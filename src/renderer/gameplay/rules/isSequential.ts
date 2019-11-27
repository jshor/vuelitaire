import IRule from '../../interfaces/IRule'
import ICard from '../../interfaces/ICard'

const isSequential: IRule = (parent: ICard, child: ICard): boolean => {
  const sequence = parent.promoted ? -1 : 1

  return parent.rank === child.rank + sequence
}

export default isSequential
