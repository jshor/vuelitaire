<template>
  <stats
    :points="points"
    :time-elapsed="timeElapsed"
  />
</template>

<script lang="ts">
import Stats from '@/components/Stats.vue'
import { Scoring } from '@/constants'
import Stopwatch from '@/gameplay/Stopwatch'
import IStatsState from '@/interfaces/IStatsState'
import Vue from 'vue'
import Component from 'vue-class-component'
import { mapActions, mapState } from 'vuex'

/**
 * The container for monitoring and broadcasting game time and score.
 */
@Component({
  components: {
    Stats
  },
  computed: {
    ...mapState('stats', [
      'points',
      'isComplete'
    ])
  },
  methods: {
    ...mapActions('stats', [
      'computeBonus',
      'deductByEpoch'
    ])
  },
  watch: {
    isComplete: {
      handler () {
        this.handleStatsUpdate()
      }
    }
  }
})
class StatsContainer extends Vue {
  /**
   * Stopwatch to monitor the game time.
   */
  public stopwatch: Stopwatch = new Stopwatch()

  /**
   * Flag for completion of the game.
   */
  public isComplete: boolean

  /**
   * Stats store module state.
   */
  public stats: IStatsState

  /**
   * The last time an epoch was recorded. Resets in `tick()`.
   */
  public lastEpoch: number = 0

  /**
   * Time, in seconds, that has elapsed since game start.
   */
  public timeElapsed: number = 0

  /**
   * Store action to deduct from the user's score for the given epochs.
   *
   * @param {number} epochs - number of game epochs
   */
  public deductByEpoch: (epochs: number) => void

  /**
   * Store action to compute the user's bonus.
   *
   * @param {number} secondsElapsed
   */
  public computeBonus: (secondsElapsed: number) => void

  /**
   * Updates the time elapsed, and updates the store to deduct from score if an epoch has passed.
   *
   * @param {number} timeElapsed - number of seconds passed
   */
  public tick (timeElapsed: number): void {
    const epochs: number = Math.floor((timeElapsed - this.lastEpoch) / Scoring.TIME_PENALTY_MS)

    if (epochs > 0) {
      this.lastEpoch = timeElapsed
      this.deductByEpoch(epochs)
    }
    this.timeElapsed = timeElapsed
  }

  public created () {
    this.stopwatch.emitter.on('tick', this.tick.bind(this))
    this.stopwatch.start()
  }

  public beforeDestroy () {
    this.stopwatch.stop()
  }

  public handleStatsUpdate () {
    if (this.isComplete) {
      this.stopwatch.stop()
      this.computeBonus(this.stopwatch.getTimeElapsed())
    }
  }
}

export default StatsContainer
</script>
