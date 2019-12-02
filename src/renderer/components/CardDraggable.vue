<template>
  <draggable
    v-if="!isSpace"
    :class="{ 'card-draggable--ready': isHighlighted }"
    :data-id="cardId"
    class="card-draggable"
    ref="card">
    <slot />
  </draggable>
  <div
    v-else
    :class="{ 'card-draggable--ready': isHighlighted }"
    :data-id="cardId"
    class="card-draggable card-draggable--space"
    ref="card">
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Draggable } from 'vue-smooth-dnd'

@Component({
  components: {
    Draggable
  },
  props: {
    isSpace: {
      type: Boolean,
      default: false
    },
    isHighlighted: {
      type: Boolean,
      default: false
    },
    cardId: {
      type: String,
      default: null
    },
    targetId: {
      type: String,
      default: null
    }
  }
})
export default class CardDraggable extends Vue {}
</script>

<style lang="scss">
.card-draggable {
  display: block;
  width: $card-width;
  height: $card-height;
  box-sizing: border-box;
  position: relative;
  border-radius: 3px;
  box-shadow: 0;
  transition: 0.2s box-shadow;
  left: 0;
  top: 0;
}

.card-draggable--animated {
  transition-duration: 250ms;
  transition-property: top, left;
}

.card-draggable--space {
  width: $card-width;
  height: $card-height;
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

.card-draggable--ready {
  box-shadow: 0px 0 30px orange;
}

.card-draggable--ready .card__front,
.card-draggable--ready .card__back {
  box-shadow: inset 0px 0 30px orange;
}

.card-draggable--ready::before {
  position: absolute;
  width: 100%;
  height: 100%;
  box-shadow: inset 0px 0 30px orange;
}
</style>
