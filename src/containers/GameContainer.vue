<template>
  <div class="game">
    <div class="game">
      <div class="game__top">
        <div class="game__foundations">
          <!-- deal card -->
          <div class="game__lane">
            <deck-container />
          </div>

          <!-- empty space (4 foundations + 1 deal card + 1 dealt pile + 1 empty space) = 7 lanes -->
          <div class="game__lane" />
          <div class="game__lane" />

          <!-- foundations pile (4) -->
          <div
            v-for="(card, key) in foundations"
            :key="key"
            class="game__lane"
          >
            <foundation :suit="card.suit" />
            <card-container :card="card" is-foundary :is-draggable="false" />
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
          <card-container :card="card" is-foundary is-fannable :is-draggable="false" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CardContainer from './CardContainer.vue'
import DeckContainer from './DeckContainer.vue'
import { useStore } from '@/store/main'
import { storeToRefs } from 'pinia'
import Foundation from '@/components/Foundation.vue'

const store = useStore()
const { tableau, foundations } = storeToRefs(store)
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
