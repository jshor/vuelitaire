<template>
  <div
    class="card-front"
    :class="`card-front card-front--${color}`"
  >
    <div class="card-front__top">
      <div class="card-front__rank">{{ rankValue }}</div>
      <div class="card-front__suit">{{ icon }}</div>
    </div>
    <div :class="`card-front__desktop card-front__desktop--${suit.toLowerCase()}-${rank + 1}`" />
    <div class="card-front__mobile">
      <div
        v-if="rank + 1 > 10"
        class="card-front__royal"
        :class="`card-front__royal--${suit.toLowerCase()}-${Math.max(rank, 11)}`"
      >
      </div>
      <div class="card-front__peasant" v-else>{{ icon }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
  suit: string,
  rank: number
}>()

const color = computed(() => {
  switch (props.suit.toLowerCase()) {
    case 'hearts':
    case 'diamonds':
      return 'red';
    default:
      return 'black';
  }
})

const rankValue = computed(() => {
  switch (props.rank + 1) {
    case 1:
      return 'A';
    case 11:
      return 'J';
    case 12:
      return 'Q';
    case 13:
      return 'K';
    default:
      return `${props.rank + 1}`
  }
})

const icon = computed(() => {
  switch (props.suit.toLowerCase()) {
    case 'hearts':
      return '♥';
    case 'diamonds':
      return '♦';
    case 'clubs':
      return '♣';
    case 'spades':
      return '♠';
    default:
      return '';
  }
})
</script>

<style lang="scss">
.card-front {
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
  font-size: 5vmin;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  box-sizing: border-box;
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background-size: cover;
  transform: rotateY(180deg);
  border-radius: var(--card-border-radius);
  border: 1px solid black;
  background-color: white;

  &--red {
    color: red;
  }
  &--black {
    color: black;
  }

  &__top {
    line-height: 0.9;
  }

  &__royal, &__peasant, &__top {
    position: absolute;
    width: 100%;
    height: 100%;
    display: block;
    display: flex;
    background-size: cover;
  }

  &__suit, &__rank {
    flex: 1;
    padding: 0.5vmin;
  }

  &__suit {
    text-align: right;
  }

  &__rank {
    text-align: left;
  }

  &__royal {
    box-sizing: border-box;
    border-radius: var(--card-border-radius);
  }

  &__peasant {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10vmin;
    margin-top: -0.5vmin;
  }

  &__mobile {
    position: absolute;
    top: 35%;
    left: 0.5vmin;
    right: 0.5vmin;
    bottom: 0.5vmin;
    max-height: 65%;
    overflow: hidden;
    border-bottom-left-radius: var(--card-border-radius);
    border-bottom-right-radius: var(--card-border-radius);
  }

  @media (min-width: 960px) {
    .card-front__mobile {
      display: none;
    }

    .card-front__desktop {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: var(--card-border-radius);
      background-size: cover;
    }
  }
}

@mixin create-mobile-card-variants($suit) {
  @for $rank from 11 through 13 {
    .card-front__royal--#{$suit}-#{$rank} {
      background-image: url('../assets/royals/#{$suit}/#{$rank}.svg');
    }
  }
}

@mixin create-desktop-card-variants($suit) {
  @for $rank from 1 through 13 {
    .card-front__desktop--#{$suit}-#{$rank} {
      background-image: url('../assets/cards/#{$suit}/#{$rank}.svg');
    }
  }
}

@include create-mobile-card-variants('hearts');
@include create-mobile-card-variants('spades');
@include create-mobile-card-variants('diamonds');
@include create-mobile-card-variants('clubs');

@include create-desktop-card-variants('hearts');
@include create-desktop-card-variants('spades');
@include create-desktop-card-variants('diamonds');
@include create-desktop-card-variants('clubs');

// @mixin create-card-variants($suit) {
//   @for $rank from 1 through 13 {
//     .card-front--#{$suit}-#{$rank} {
//       background-image: url('../assets/cards/#{$suit}/#{$rank}.svg');
//     }
//   }
// }

// @include create-card-variants('hearts');
// @include create-card-variants('spades');
// @include create-card-variants('diamonds');
// @include create-card-variants('clubs');

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
