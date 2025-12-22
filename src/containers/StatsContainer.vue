<template>
  <stats
    :points="points"
    :time-elapsed="timeElapsed"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapState } from 'vuex';
import Stats from '@/components/Stats';
import Stopwatch from '@/gameplay/Stopwatch';
import { Scoring } from '@/constants';

export default defineComponent({
  name: 'StatsContainer',
  components: { Stats },
  computed: {
    ...mapState('stats', ['points', 'isComplete'])
  },
  watch: {
    isComplete: {
      handler() {
        this.handleStatsUpdate();
      }
    }
  },
  data() {
    return {
      stopwatch: new Stopwatch(),
      lastEpoch: 0,
      timeElapsed: 0
    };
  },
  methods: {
    ...mapActions('stats', ['deductByEpoch', 'computeBonus']),
    tick(timeElapsed: number) {
      const epochs: number = Math.floor((timeElapsed - this.lastEpoch) / Scoring.TIME_PENALTY_MS);

      if (epochs > 0) {
        this.lastEpoch = timeElapsed;
        this.deductByEpoch(epochs);
      }
      this.timeElapsed = timeElapsed;
    },
    handleStatsUpdate() {
      if (this.isComplete) {
        this.stopwatch.stop();
        this.computeBonus(this.stopwatch.getTimeElapsed());
      }
    }
  },
  created() {
    this.stopwatch.emitter.on('tick', this.tick.bind(this));
    this.stopwatch.start();
  },
  beforeDestroy() {
    this.stopwatch.stop();
  }
});
</script>
