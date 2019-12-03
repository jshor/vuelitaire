<template>
  <div class="winner">
    <canvas class="winner__confetti" ref="winner" />
    <div class="winner__title">You won!</div>
  </div>
</template>

<script lang="ts">
import IConfetti from '@/interfaces/IConfetti'
import confetti from 'canvas-confetti'
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'Stats',
  props: {
    theme: {
      type: String,
      default: 'green'
    }
  }
})
export default class Stats extends Vue {
  public theme: string

  public canvas: IConfetti

  public confettiEnd: number

  public mounted () {
    this.canvas = this.$refs.winner as IConfetti

    this.canvas.confetti = this.canvas.confetti || confetti.create(this.canvas, {
      resize: true
    })

    this.confettiEnd = Date.now() + (15 * 1000000)
    this.animateConfetti()
  }

  public assignConfettiFromTrajectory (trajectory: {
    angle: number,
    spread: number,
    origin: {
      [x: string]: number
    }
  }) {
    const colors: string[] = ['#133315', '#ffffff']

    this.canvas.confetti({
      particleCount: 2,
      colors,
      ...trajectory
    })
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

  &__title {
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    font-family: script, Geneva, "Segoe UI", Helvetica, Arial, system-ui, sans-serif;
    font-size: 3rem;
    padding: 0.5rem;
    color: #fff;
    text-shadow: 1px 1px 1px #000;
  }

  &__title, &__confetti {
    position: absolute;
    width: 100%;
    height: 100%;
  }
}
</style>
