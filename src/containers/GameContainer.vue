<template>
  <div class="game">
    <div class="game">
      <div class="game__top">
        <div class="game__foundations">
          <!-- deal card -->
          <div class="game__lane" @click="deal">
            <card-back v-if="hasStockCards" />
            <empty-space v-else>
              <empty-stock-icon />
            </empty-space>
            <card-highlight v-if="isDealHint" />
          </div>

          <!-- dealt pile -->
          <div class="game__lane game__lane--dealt">
            <card-container :card="dealSpace" is-foundary is-dealable is-revealed :is-selectable="false" />
          </div>

          <!-- empty space (4 foundations + 1 deal card + 1 dealt pile + 1 empty space) = 7 lanes -->
          <div class="game__lane" />

          <!-- foundations pile (4) -->
          <div
            v-for="(card, key) in foundations"
            :key="key"
            class="game__lane"
          >
            <foundation :suit="card.suit" />
            <card-container :card="card" is-foundary :is-selectable="false" />
          </div>
        </div>
      </div>

      <!-- tableau -->
      <div class="game__tableau">
        <div
          v-for="(card, key) in tableau"
          :key="key"
          class="game__lane"
        >
          <card-container :card="card" is-foundary is-fannable :is-selectable="false" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CardBack from '@/components/CardBack.vue'
import EmptySpace from '@/components/EmptySpace.vue'
import CardHighlight from '@/components/CardHighlight.vue'
import EmptyStockIcon from '@/components/EmptyStockIcon.vue'
import CardContainer from './CardContainer.vue'
import { useStore } from '@/store/main'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import Foundation from '@/components/Foundation.vue'
import { overrideAnimation } from '@/utils/overrideAnimation'

const store = useStore()
const { tableau, hasStockCards, foundations, dealSpace } = storeToRefs(store)
const isDealHint = computed(() => store.currentHint.some(hint => hint.includes('DEAL_CARD')))

/** Deals a new card. */
function deal() {
  overrideAnimation(() => store.deal())
}
</script>

<style lang="scss">
.game {
  display: flex;
  flex-direction: column;
  width: 100%;

  &__top {
    flex: 1;
    display: flex;
    padding: 4vmin 0;
  }

  &__foundations {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    justify-content: space-around;
  }

  &__tableau {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    width: 100%;
    justify-content: space-around;
  }

  &__lane {
    display: flex;
    box-sizing: border-box;
    width: var(--card-width);
    flex-direction: column;
    position: relative;

    &--dealt {
      left: calc(-1 * var(--card-fanning-space));
    }
  }
}
</style>
