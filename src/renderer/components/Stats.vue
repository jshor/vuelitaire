<template>
  <div class="stats">
    <i class="fas fa-chalkboard" />&nbsp;{{ score }}
    &middot;
    <i class="fas fa-stopwatch" />&nbsp;{{ clock }}
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import formatClock from '@/utils/formatClock'

@Component({
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
  }
})
export default class Stats extends Vue {
  public timeElapsed: number

  public points: number

  get clock () {
    return formatClock(this.timeElapsed)
  }

  get score () {
    return this.points.toLocaleString()
  }
}
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
