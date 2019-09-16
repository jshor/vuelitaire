<template>
  <draggable
    v-if="!isSpace"
    :class="{ 'card-draggable--ready': isReady }"
    class="card-draggable">
    <slot />
  </draggable>
  <div
    v-else
    class="card-draggable card-draggable--space">
    <slot />
  </div>
</template>

<script>
import { Draggable } from 'vue-smooth-dnd'

export default {
  name: 'CardDraggable',
  components: { Draggable },
  props: {
    isSpace: {
      type: Boolean,
      default: false
    },
    isReady: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style>
.card-draggable {
  display: block;
  width: 100px;
  height: 150px;
  background-color: lightblue;
  border: 1px solid #c0c0c0;
  box-sizing: border-box;
  top: 20px;
  left: -1px;
  position: relative;
  border-radius: 3px;
  font: 12px Arial, Helvetica, sans-serif;
  transition-duration: 0ms !important;
}

.card-draggable--ready {
  box-shadow: 0px 0 3px red;
}

.card-draggable--space > .card-draggable {
  top: -1px;
}

.card-draggable.smooth-dnd-ghost.animated {
  margin-top: 20px;
  margin-left: -1px;
  transition-duration: 250ms !important;
}

.card-draggable.smooth-dnd-ghost > .highlight {
  display: block;
}
</style>
