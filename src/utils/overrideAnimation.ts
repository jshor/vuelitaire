/**
 * Overrides any in-progress animations by finishing them immediately to
 * execute the provided callback on the next animation frame.
 */
export function overrideAnimation(cb: () => void) {
  document
    .getAnimations()
    .forEach(animation => animation.finish())

  requestAnimationFrame(() => cb())
}
