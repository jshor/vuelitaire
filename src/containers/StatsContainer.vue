<template>
  <stats
    :points="points"
    :time-elapsed="timeElapsed"
  />
</template>

<script lang="ts" setup>
import { onBeforeUnmount, ref, watch } from 'vue';
import Stats from '@/components/Stats.vue';
import Stopwatch from '@/gameplay/Stopwatch';
import { Scoring } from '@/constants';
import { useStore } from '@/store/main';
import { storeToRefs } from 'pinia';

const store = useStore()
const { points, isComplete } = storeToRefs(store)
const { deductByEpoch, computeBonus } = store
const stopwatch = new Stopwatch()
const lastEpoch = ref(0)
const timeElapsed = ref(0)

watch(isComplete, handleStatsUpdate)

onBeforeUnmount(stopwatch.stop)

stopwatch.emitter.on('tick', tick);
stopwatch.start();

function tick(tickElapsed: number) {
  const epochs: number = Math.floor((tickElapsed - lastEpoch.value) / Scoring.TIME_PENALTY_MS);

  if (epochs > 0) {
    lastEpoch.value = tickElapsed
    deductByEpoch(epochs);
  }
  timeElapsed.value = tickElapsed
}

function handleStatsUpdate() {
  if (isComplete.value) {
    stopwatch.stop();
    computeBonus(stopwatch.getTimeElapsed());
  }
}
</script>
