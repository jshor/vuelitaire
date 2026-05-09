<template>
  <div class="stats" :class="{
    'stats--paused': isPaused
  }">
    <i class="fas fa-chalkboard" />&nbsp;{{ score }}
    &middot;
    <i class="fas fa-stopwatch" />&nbsp;{{ clock }}
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { formatClock } from '@/utils/formatClock'

const props = withDefaults(defineProps<{
  timeElapsed?: number
  points?: number
  isPaused?: boolean
}>(), {
  timeElapsed: 0,
  points: 0,
  isPaused: false
})

const clock = computed(() => formatClock(props.timeElapsed))
const score = computed(() => props.points.toLocaleString())
</script>

<style lang="scss">
.stats {
  font-family: "Segoe UI", Helvetica, Arial, system-ui, sans-serif;
  font-size: 1rem;
  padding: 0.5vmin 1vmin;
  height: 100%;
  display: flex;
  align-items: center;
  color: #fff;
  text-shadow: 1px 1px 1px #000;

  &--paused {
    color: #f00;
    animation: blinker 1s linear infinite;
  }
}

@keyframes blinker {
  50% {
    opacity: 0;
  }
}
</style>
