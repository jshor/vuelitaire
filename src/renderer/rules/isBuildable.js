export default function isBuildable (parent, child) {
  if (child.type !== 'CARD') {
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
