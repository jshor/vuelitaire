<template>
  <draggable
    v-if="!isSpace"
    :class="{ 'card-draggable--ready': isReady }"
    class="card-draggable">
    <slot />
  </draggable>
  <div
    v-else
    :class="{ 'card-draggable--ready': isReady }"
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
  width: 10vw;
  height: 14vw;
  box-sizing: border-box;
  position: relative;
  border-radius: 3px;
  box-shadow: 0;
  transition: 0.2s box-shadow;
}

.card-draggable--space {
  width: 10vw;
  height: 14vw;
  /* border: 1px solid #000; */
  box-sizing: border-box;
}

.card-draggable--space::before {
  position: absolute;
  content: ' ';
  display: block;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border: 2px solid rgba(255,255,255,0.4);
  border-radius: 3px;
}

.card-draggable.animated:not(.smooth-dnd-ghost) {
  display: none;
}

.card-draggable.smooth-dnd-ghost > .highlight {
  display: block;
}

.card-draggable--ready {
  box-shadow: 0px 0 30px orange;
}
</style>
