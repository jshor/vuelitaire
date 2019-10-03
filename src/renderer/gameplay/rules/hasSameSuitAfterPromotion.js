export default function hasSameSuitAfterPromotion (parent, target) {
  if (!parent.promoted) {
    return true // skips this check
  }
  return parent.suit === target.suit && !target.child
}
