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
import { defineComponent } from 'vue'
import Congratulations from './Congratulations'

export default defineComponent({
  name: 'Winner',
  components: { Congratulations },
  props: {
    isComplete: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    isComplete: {
      handler() {
        this.end()
      }
    }
  },
  data() {
    return {
      canvas: null,
      confettiEnd: 0
    }
  },
  methods: {
    end() {
      // ...existing code...
    }
  }
})
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
