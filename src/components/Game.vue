<template>
  <div class="game">
    <div
      class="game__main"
      :class="{
        'game__main--paused': isPaused
      }">
      <div class="game__top">
        <div class="game__grid">
          <!-- deal card -->
          <lane>
            <slot name="dealer" />
          </lane>

          <!-- empty space (4 foundations + 1 deal card + 1 dealt pile + 1 empty space) = 7 lanes -->
          <lane />
          <lane />

          <slot name="foundations" />
        </div>
      </div>

      <div class="game__grid">
        <slot name="tableau" />
      </div>
    </div>

    <div v-if="isPaused" class="game__paused" />

    <congratulations
      :is-active="isComplete"
      @end="$emit('end')"
    />

    <div class="game__actions">
      <div class="game__stats">
        <slot name="stats" />
      </div>

      <div class="game__buttons">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Lane from './Lane.vue'

defineProps<{
  isPaused: boolean
  isComplete: boolean
}>()

defineEmits<{
  (e: 'end'): void
}>()
</script>

<style lang="scss">
.game {
  padding: 0 1vmin;
  box-sizing: border-box;
  flex-direction: column;
  width: 100vmin;
  height: 100vmin;
  margin: auto;
  max-width: 100%;
  max-height: 100%;
  transform: filter var(--animation-speed);
  touch-action: none;

  &__main {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;

    &--paused {
      filter: blur(1vmin);
    }
  }

  &__paused {
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(0,0,0,0.25);
  }

  &__top {
    display: flex;
    padding: 4vmin 0;
  }

  &__grid {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    justify-content: space-around;
  }

  &__actions {
    position: absolute;
    bottom: 0;
    width: 100vmin;
    display: flex;

    @media (max-width: 480px) {
      flex-direction: column;
    }
  }

  &__stats {
    flex: 1;
  }

  &__buttons {
    display: flex;
    padding: 0.5vmin;
  }
}
</style>

