<template>
  <div
    :class="{
      [`card--${this.suit.toLowerCase()}-${this.rank + 1}`]: true,
      ['card--revealed']: revealed,
      ['card--error']: error,
      ['card--dealing']: animationIndex
    }"
    :style="style"
    class="card"
    ref="card">
    <div class="card__inner" v-if="!isSpace">
      <card-back class="card__back" />
      <div class="card__front"></div>
    </div>
    <div class="space" v-else></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import CardBack from './CardBack.vue'

@Component({
  name: 'Card',
  components: {
    CardBack
  },
  props: {
    suit: {
      type: String,
      default: '?'
    },
    rank: {
      type: Number,
      default: 0
    },
    revealed: {
      type: Boolean,
      default: false
    },
    isSpace: {
      type: Boolean,
      default: false
    },
    error: {
      type: Boolean,
      default: false
    },
    animationIndex: {
      type: Number,
      default: 0
    }
  }
})
export default class Card extends Vue {
  public style: {
    '--left'?: string,
    '--top'?: string,
    '--index'?: number
  } = {}

  public animationIndex: number

  public mounted (): void {
    const el = this.$refs.card as HTMLElement
    const { left: bx, top: by } = el.getBoundingClientRect()
    const { left: ax, top: ay } = document
      .querySelector('[data-id="DEAL_CARD"]')
      .getBoundingClientRect()

    this.style = {
      '--left': `${ax - bx}px`,
      '--top': `${ay - by}px`,
      '--index': this.animationIndex
    }
  }
}
</script>

<style lang="scss">
.card {
  position: absolute;
  width: $card-width;
  height: $card-height;
  perspective: 1000px;
  transition: 250ms margin;
}

.card--dealing {
  animation-delay: calc(var(--index) * 50ms);
  animation-duration: 250ms;
  animation-fill-mode: forwards;
  animation-name: dealing;
  opacity: 0;
}

@keyframes dealing {
  from {
    opacity: 1;
    transform: translate(var(--left), var(--top));
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.card--error {
  animation: shake 250ms cubic-bezier(.36,.07,.19,.97) forwards;
}

@include create-card-variants('hearts');
@include create-card-variants('spades');
@include create-card-variants('diamonds');
@include create-card-variants('clubs');

.card__inner {
  position: absolute;
  width: 100%;
  height: 100%;
  transition: transform 0.25s;
  box-sizing: border-box;
  transform-style: preserve-3d;
}

.card--revealed .card__inner {
  transform: rotateY(180deg);
}

.card__front {
  font: 1rem Arial, Helvetica, sans-serif;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  box-sizing: border-box;
  border-radius: 3px;
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}

.card__back {
  position: absolute;
}

.card__front {
  background-size: cover;
  // background-color: #fff;
}

.card__front {
  transform: rotateY(180deg);
}

.space {
  width: $card-width;
  height: $card-height;
  border-width: 5px;
  border-style: solid;
  box-sizing: border-box;
  background-color: #000;
}

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
