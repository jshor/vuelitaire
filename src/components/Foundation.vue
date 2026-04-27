<template>
  <div class="foundation">
    {{ icon }}
  </div>
</template>

<script lang="ts" setup>
import { defineProps, computed } from 'vue'
import { Suits } from '@/constants'

const props = defineProps<{
  suit: string
}>()

const icon = computed(() => {
  switch (props.suit) {
    case Suits.CLUBS:
      return '♣'
    case Suits.DIAMONDS:
      return '♦'
    case Suits.HEARTS:
      return '♥'
    default:
      return '♠'
  }
})
</script>

<style lang="scss">
.foundation {
  position: absolute;
  top: 0;
  left: 0;
  width: var(--card-width);
  height: var(--card-height);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 5vmin;
  color: #fff;
  opacity: 0.5;
  font-family: "Segoe UI", Helvetica, Arial, system-ui, sans-serif;
}
</style>
