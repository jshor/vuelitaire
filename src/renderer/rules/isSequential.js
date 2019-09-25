export default function isSequential (parent, child) {
  return parent.rank === child.rank + 1
}
