export default function isSequential (parent, child) {
  const sequence = parent.promoted ? -1 : 1

  return parent.rank === child.rank + sequence
}
