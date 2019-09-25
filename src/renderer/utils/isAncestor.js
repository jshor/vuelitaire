export default function isAncestor (parent, card) {
  while (parent) {
    if (parent.$props && parent.$props.card) {
      if (parent.$props.card.id === card.id) {
        return true
      }
    }
    parent = parent.$parent
  }
  return false
}
