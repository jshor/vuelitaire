<template>
  <div
    class="winner"
    :class="{ 'winner--done': !isComplete }">
    <canvas class="winner__confetti" ref="winner" />
    <div class="winner__title" v-show="isComplete">
      <congratulations />
      <div
        @click="$emit('redeal')"
        class="winner__redeal">
        Deal again
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import IConfetti from '@/interfaces/IConfetti'
import confetti from 'canvas-confetti'
import Vue from 'vue'
import Component from 'vue-class-component'
import Congratulations from './Congratulations'

@Component({
  name: 'Winner',
  props: {
    isComplete: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    isComplete: {
      handler () {
        this.end()
      }
    }
  },
  components: {
    Congratulations
  }
})
export default class Winner extends Vue {
  public isComplete: boolean

  public canvas: IConfetti

  public confettiEnd: number

  public mounted () {
    this.canvas = this.$refs.winner as IConfetti

    // this.canvas.confetti = this.canvas.confetti || confetti.create(this.canvas, {
    //   resize: true
    // })
  }

  public assignConfettiFromTrajectory (trajectory: {
    angle: number,
    spread: number,
    origin: {
      [x: string]: number
    }
  }) {
    const colors: string[] = ['#133315', '#ffffff']

    // this.canvas.confetti({
    //   particleCount: 2,
    //   colors,
    //   ...trajectory
    // })
  }

  public animateConfetti () {
    this.assignConfettiFromTrajectory({
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    })
    this.assignConfettiFromTrajectory({
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    })

    if (Date.now() < this.confettiEnd) {
      requestAnimationFrame(this.animateConfetti)
    }
  }

  public end () {
    this.confettiEnd = this.isComplete
      ? Date.now() + (15 * 1000000)
      : Date.now()

    this.animateConfetti()
  }
}
</script>

<style lang="scss">
.winner {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1001;
  color: #fff;

  &--done {
    pointer-events: none;
  }

  &__title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: "Luckiest Guy", script, Geneva, "Segoe UI", Helvetica, Arial, system-ui, sans-serif;
    padding: 0.5rem;
    text-shadow: 1px 1px 1px #000;
    overflow: hidden;
  }

  &__redeal {
    text-decoration: underline;
    cursor: pointer;
    animation: redeal 0.25s forwards;
    animation-delay: 2s;
    opacity: 0;
  }

  &__title, &__confetti {
    position: absolute;
    width: 100%;
    height: 100%;
  }
}

@keyframes redeal {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
