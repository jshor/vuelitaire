<template>
  <div class="card" ref="card" :class="{ 'card--revealed': revealed }">
    <div class="card__inner" v-if="!isSpace">
      <div class="card__front">{{ suit }} {{ rank }}</div>
      <div class="card__back">back</div>
    </div>
    <div v-else>space</div>
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
    }
  }
}
</script>

<style>
.card {
  position: absolute;
  width: 100px;
  height: 150px;
  perspective: 1000px;
}

.card__inner {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 1px solid #000;
  box-sizing: border-box;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

.card--revealed .card__inner {
  transform: rotateY(180deg);
}

.card__front, .card__back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}

.card__front {
  background-color: #bbb;
  color: black;
}

.card__front {
  background-color: lightblue;
  transform: rotateY(180deg);
}
</style>
