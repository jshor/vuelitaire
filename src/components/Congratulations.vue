<template>
  <div class="congratulations" v-show="isVisible">
    <div class="congratulations__text">you won!</div>
    <div class="congratulations__end"
      :class="{
        'congratulations__end--visible': canEnd
      }"

    @click="$emit('end')">Deal again?</div>
  </div>
</template>

<script lang="ts" setup>
import confetti from 'canvas-confetti'
import { watch, ref, computed, defineProps } from 'vue'

const props = defineProps<{
  isActive: boolean
}>()

/** Whether the confetti animation is complete. */
const isComplete = ref(false)

/** Whether the confetti animation can be ended. */
const canEnd = ref(false)

/** The timestamp at which the confetti animation should end. */
const confettiEnd = ref(Infinity)

/** Whether the congratulations should be visible. */
const isVisible = computed(() => props.isActive && !isComplete.value)

watch(() => props.isActive, isActive => {
  isActive ? animateConfetti() : end()
}, {
  immediate: true
})

/**
 * Starts confetti from the given trajectory definition.
 */
function assignConfettiFromTrajectory (trajectory: {
  /** Angle, in degrees, of confetti. */
  angle: number,
  /** Spread, in degrees, of confetti. */
  spread: number,
  /** Origin point of confetti. */
  origin: {
    [x: string]: number
  }
}) {
  const colors: string[] = ['#133315', '#ffffff']

  confetti({
    particleCount: 2,
    colors,
    ...trajectory
  })

  setTimeout(() => {
    canEnd.value = true
  }, 3000)
}

/**
 * Animation frame confetti.
 */
function animateConfetti () {
  if (!isVisible.value) {
    return
  }

  assignConfettiFromTrajectory({
    angle: 120,
    spread: 55,
    origin: { x: 1 }
  })
  assignConfettiFromTrajectory({
    angle: 60,
    spread: 55,
    origin: { x: 0 }
  })

  if (Date.now() < confettiEnd.value) {
    requestAnimationFrame(animateConfetti)
  }
}

/**
 * Ends the confetti animation.
 */
function end () {
  confettiEnd.value = isComplete.value
    ? Date.now() + (15 * 1000000)
    : Date.now()
  canEnd.value = false

  animateConfetti()
}
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Luckiest+Guy");

.congratulations {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: block;
  width: 100vw;
  height: 100vh;
  font-family: "Luckiest Guy", cursive;
  cursor: default;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #fff;

  &__text {
    position: relative;
    top: 20px;
    display: inline-block;
    animation: bounce 0.3s ease infinite alternate;
    font-size: 14vmin;
    text-shadow: 0 1px 0 #ccc, 0 2px 0 #ccc, 0 3px 0 #ccc, 0 4px 0 #ccc,
      0 5px 0 #ccc, 0 6px 0 transparent, 0 7px 0 transparent, 0 8px 0 transparent,
      0 9px 0 transparent, 0 10px 10px rgba(0, 0, 0, 0.4);
  }

  &__end {
    text-shadow: 0 1px 0 #000;
    cursor: pointer;
    font-size: 2vmin;
    opacity: 0;
    transition: 500ms opacity;

    &--visible {
      opacity: 1;
    }

    &:hover {
      text-decoration: underline;
    }
  }
}

@keyframes bounce {
  100% {
    top: -20px;
    text-shadow: 0 1px 0 #ccc, 0 2px 0 #ccc, 0 3px 0 #ccc, 0 4px 0 #ccc,
      0 5px 0 #ccc, 0 6px 0 #ccc, 0 7px 0 #ccc, 0 8px 0 #ccc, 0 9px 0 #ccc,
      0 50px 25px rgba(0, 0, 0, 0.2);
  }
}
</style>
