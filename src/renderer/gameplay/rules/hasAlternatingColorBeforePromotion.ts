import hasAlternatingColor from './hasAlternatingColor'
import IRule from '../IRule'
import ICard from '../../types/interfaces/ICard'

const hasAlternatingColorBeforePromotion: IRule = (parent: ICard, child: ICard): boolean => {
  if (parent.promoted) {
    return true
  }
  return hasAlternatingColor(parent, child)
}

export default hasAlternatingColorBeforePromotion
