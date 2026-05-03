<template>
  <div class="deck">
    <div class="deck__pile">
      <div
        class="pile-card"
        v-for="(card, k) in stock"
        :key="card.index"
        :style="{
          left: dealIndex < stock.length && dealIndex >= k
            ? `calc(${getLeft(k) - 1} * var(--card-fanning-space) + var(--card-width) + var(--card-fanning-space))`
            : `0`,
          zIndex: k === dealIndex ? 1 : undefined,
        }"
      >
        <card-container
          v-if="k !== dealIndex"
          :card="card"
          :is-revealed="dealIndex < stock.length && dealIndex >= k - DEALT_CARDS_DISPLAYED"
          :is-selectable="false"
          reveal
        />
        <card-container v-else :card="dealSpace" />
      </div>
    </div>

    <div class="deck__dealer" @click="deal">
      <empty-space v-if="dealIndex === stock.length - 1">
        <empty-stock-icon />
      </empty-space>
      <card-back v-else />
      <card-highlight v-if="isDealHint" />
    </div>
  </div>
</template>

<script lang="ts" setup>
// TODO: rename to DealContainer
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import CardBack from '@/components/CardBack.vue'
import EmptySpace from '@/components/EmptySpace.vue'
import CardHighlight from '@/components/CardHighlight.vue'
import EmptyStockIcon from '@/components/EmptyStockIcon.vue'
import CardContainer from './CardContainer.vue'
import { useStore } from '@/store/main'
import { overrideAnimation } from '@/utils/overrideAnimation'
import { DEALT_CARDS_DISPLAYED } from '@/constants'

const store = useStore()
const { dealIndex, dealSpace, stock } = storeToRefs(store)
const isDealHint = computed(() => store.currentHint.some(hint => hint.includes('DEAL_CARD')))

function deal() {
  overrideAnimation(() => {
    store.deal()
  })
}

function getLeft(k: number) {
  if (dealIndex.value < stock.value.length && dealIndex.value >= k) {
    if (dealIndex.value < DEALT_CARDS_DISPLAYED) {
      return k + 1
    } else if (dealIndex.value - k >= DEALT_CARDS_DISPLAYED - 1) {
      return 1
    } else {
      return DEALT_CARDS_DISPLAYED - (dealIndex.value - k)
    }
  }

  return 1
}
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

.pile-card {
  position: absolute;
  transition: all var(--animation-speed);
  width: var(--card-width);
  height: var(--card-height);
}
</style>
