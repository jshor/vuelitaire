<template>
  <div
    class="pile-card"
    :style="style"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { computed, CSSProperties } from 'vue'

const props = defineProps<{
  isTop: boolean
  isVisible: boolean
  index: number
}>()

const style = computed((): CSSProperties => ({
  zIndex: props.isTop ? 1 : undefined,
  left: props.isVisible
    ? `calc(${
      [
        `${props.index} * var(--card-fanning-space)`,
        'var(--card-width)',
        'var(--card-fanning-space)'
      ].join(' + ')
    })`
    : 0,
}))
</script>

<style lang="scss">
.pile-card {
  position: absolute;
  transition: all var(--animation-speed);
  width: var(--card-width);
  height: var(--card-height);
}
</style>
