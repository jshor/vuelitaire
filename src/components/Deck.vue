<template>
  <div class="deck">
    <div class="deck__pile">
      <slot />
    </div>

    <div class="deck__dealer" @click="$emit('deal')">
      <empty-space v-if="isEmpty">
        <empty-stock-icon />
      </empty-space>
      <card-back v-else />
      <card-highlight v-if="showHint" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import CardBack from './CardBack.vue'
import EmptySpace from './EmptySpace.vue'
import CardHighlight from './CardHighlight.vue'
import EmptyStockIcon from './EmptyStockIcon.vue'

defineProps<{
  showHint: boolean
  isEmpty: boolean
}>()


defineEmits<{
  (e: 'deal'): void
}>()
</script>

<style lang="scss">
.deck {
  display: flex;

  &__dealer {
    width: 10vmin;
    height: 14vmin;
    z-index: 99999;
  }

  &__pile {
    position: relative;
  }
}
</style>
