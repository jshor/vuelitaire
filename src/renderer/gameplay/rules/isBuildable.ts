import Card from '../../models/Card'
import IRule from '../IRule'
import ICard from '../../types/interfaces/ICard'

const isBuildable: IRule = (parent: ICard, child: ICard): boolean => {
  if (!(child instanceof Card)) {
    return false
  }
  if (parent.child || parent.id === child.id) {
    return false
  }
  if (!parent.isPlayed) {
    return false
  }
  if (!parent.revealed || !child.revealed) {
    return false
  }
  return true
}

export default isBuildable
