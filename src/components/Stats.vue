<template>
  <div class="stats">
    <i class="fas fa-chalkboard" />&nbsp;{{ score }}
    &middot;
    <i class="fas fa-stopwatch" />&nbsp;{{ clock }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import formatClock from '@/utils/formatClock'

export default defineComponent({
  name: 'Stats',
  props: {
    timeElapsed: {
      type: Number,
      default: 0
    },
    points: {
      type: Number,
      default: 0
    }
  },
  computed: {
    clock() {
      return formatClock(this.timeElapsed)
    },
    score() {
      return this.points.toLocaleString()
    }
  }
})
</script>

<style lang="scss">
.stats {
  font-family: "Segoe UI", Helvetica, Arial, system-ui, sans-serif;
  font-size: 1rem;
  padding: 0.5rem;
  color: #fff;
  text-shadow: 1px 1px 1px #000;
}
</style>
