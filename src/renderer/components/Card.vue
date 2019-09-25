<template>
  <div @click="$emit('click')" class="card" ref="card"
    :class="className">
    <div class="card__inner" v-if="!isSpace">
      <div class="card__front"></div>
      <div class="card__back"></div>
    </div>
    <div class="space" v-else></div>
  </div>
</template>

<script>
import { Suits } from '../constants'

export default {
  name: 'Card',
  props: {
    suit: {
      type: String,
      default: '?'
    },
    cardId: {
      type: String,
      default: 'X'
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
    }
  },
  computed: {
    className () {
      let className = `card--${this.suit.toLowerCase()}-${this.rank + 1}`

      if (this.revealed) {
        className += ' card--revealed'
      }
      return className
    },
    symbol () {
      switch (this.suit) {
        case Suits.DIAMONDS:
          return '◆'
        case Suits.CLUBS:
          return '♣'
        case Suits.SPADES:
          return '♠'
        case Suits.HEARTS:
          return '♥'
      }
    }
  }
}
</script>

<style lang="scss">
.card {
  position: absolute;
  width: $card-width;
  height: 14vw;
  perspective: 1000px;
}

@include create-card-variants('hearts');
@include create-card-variants('spades');
@include create-card-variants('diamonds');
@include create-card-variants('clubs');

.card__big {
  padding-top: 2rem;
  text-align: center;
  font-size: 1.5rem;
}

.card__small {
  padding-left: 0.5rem;
}

.card--hearts,
.card--diamonds {
  color: red;
}

.card__inner {
  position: absolute;
  width: 100%;
  height: 100%;
  transition: transform 0.35s;
  box-sizing: border-box;
  transform-style: preserve-3d;
}

.card--revealed .card__inner {
  transform: rotateY(180deg);
}

.card__front, .card__back {
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
  border: 1px solid #000;
  background: repeating-linear-gradient(
    45deg,
    #606dbc,
    #606dbc 10px,
    #465298 10px,
    #465298 20px
  );
}

.card__front {
  background-size: cover;
  // background-color: #fff;
}

.card__front {
  transform: rotateY(180deg);
}

.space {
  width: 10vw;
  height: 14vw;
  /* border: 1px solid #000; */
  border-width: 5px;
  border-style: solid;
  box-sizing: border-box;
  background-color: #000;
  border-image: linear-gradient(115deg,#4fcf70,#fad648,#a767e5,#12bcfe,#44ce7b);
}
</style>
