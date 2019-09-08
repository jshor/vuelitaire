<template>
  <div class="card card--space">
    {{ suit }} {{ rank }}
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
    }
  }
}
</script>

<style>
.card {
  position: absolute;
  width: 100px;
  height: 150px;
}

.card__inner {
  position: absolute;
  width: 100px;
  height: 150px;
}
</style>
