<template>
  <div
    :class="`card-front--${this.suit.toLowerCase()}-${this.rank + 1}`"
    class="card-front"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'CardFront',
  props: {
    suit: {
      type: String,
      default: '?'
    },
    rank: {
      type: Number,
      default: 0
    }
  }
})
export default class CardFront extends Vue {}
</script>

<style lang="scss">

.card-front {
  font: 1rem Arial, Helvetica, sans-serif;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  box-sizing: border-box;
  border-radius: 3px;
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background-size: cover;
  transform: rotateY(180deg);
}

@include create-card-variants('hearts');
@include create-card-variants('spades');
@include create-card-variants('diamonds');
@include create-card-variants('clubs');

@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>
