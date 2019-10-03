import hasAlternatingColor from './hasAlternatingColor'

export default function hasAlternatingColorBeforePromotion (parent, child) {
  if (parent.promoted) {
    return true
  }
  return hasAlternatingColor(parent, child)
}
