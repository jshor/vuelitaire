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
      <div class="card__back"></div>
      <div class="card__front"></div>
    </div>
    <div class="space" v-else></div>
  </div>
</template>

<script>
export default {
  name: 'Card',
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
  },
  data () {
    return {
      style: {}
    }
  },
  mounted () {
    const { left: bx, top: by } = this.$refs
      .card
      .getBoundingClientRect()
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
  height: 14vw;
  perspective: 1000px;
  transition: 250ms margin;

  // transform: translate(var(--left), var(--top));
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

.card--ghost {
  display: none;
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
  transition: transform 0.25s;
  box-sizing: border-box;
  transform-style: preserve-3d;
}

.card__inner--moving {
  z-index: 100000000000000;
}

.card--revealed .card__inner {
  transform: rotateY(180deg);
}

.card--revealed .card-container {
  border: 1px solid red;
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
