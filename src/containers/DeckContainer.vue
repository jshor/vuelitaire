<template>
  <deck
    :show-hint="showHint"
    :is-empty="dealIndex === stock.length - 1"
    @deal="deal"
  >
    <pile-card
      v-for="(card, k) in stock"
      :key="k"
      :is-top="k === dealIndex"
      :is-visible="dealIndex < stock.length && dealIndex >= k"
      :index="getLeftFanningSpace(k) - 1"
    >
      <card-container
        v-if="k !== dealIndex"
        :card="card"
        :is-revealed="dealIndex < stock.length && dealIndex >= k - DEALT_CARDS_DISPLAYED"
        :is-selectable="false"
        reveal
      />
      <card-container v-else :card="dealSpace" />
    </pile-card>
  </deck>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import Deck from '@/components/Deck.vue'
import PileCard from '@/components/PileCard.vue'
import CardContainer from './CardContainer.vue'
import { useStore } from '@/store/main'
import { overrideAnimation } from '@/utils/overrideAnimation'
import { DEAL_CARD_ID, DEALT_CARDS_DISPLAYED } from '@/constants'

const store = useStore()
const { dealIndex, dealSpace, stock } = storeToRefs(store)
const showHint = computed(() => {
  return store.currentHint.some(hint => hint.includes(DEAL_CARD_ID))
})

/** Deals a new card. */
function deal() {
  overrideAnimation(() => {
    store.deal()
  })
}

/** Returns the number of fanning spaces to the left of a visibly-dealt card. */
function getLeftFanningSpace(k: number) {
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
