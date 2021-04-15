<template>
  <draggable
    v-if="!isSpace"
    :class="{ 'card-draggable--ready': isHighlighted }"
    :data-id="cardId"
    class="card-draggable"
    ref="card">
    <slot />
  </draggable>
  <empty-space
    v-else
    :class="{ 'card-draggable--ready': isHighlighted }"
    :data-id="cardId">
    <slot />
  </empty-space>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Draggable } from 'vue-smooth-dnd'
import EmptySpace from './EmptySpace'

@Component({
  components: {
    Draggable,
    EmptySpace
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

  &--animated {
    transition-duration: 250ms;
    transition-property: top, left;
  }

  &.animated:not(.smooth-dnd-ghost) {
    display: none;
  }

  &--ready {
    box-shadow: 0px 0 30px orange;

    &::before {
      position: absolute;
      width: 100%;
      height: 100%;
      box-shadow: inset 0px 0 30px orange;
    }

    .card-front, .card-back, .empty-space {
      box-shadow: inset 0px 0 30px orange;
    }
  }
}
</style>
