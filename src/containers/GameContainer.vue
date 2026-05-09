<template>
  <game
    :is-complete="isComplete"
    :is-paused="isPaused"
    @end="$emit('end')"
  >
    <template #dealer>
      <deck-container />
    </template>

    <template #foundations>
      <!-- foundations piles (4) -->
      <lane
        v-for="(card, key) in foundations"
        :key="key"
      >
        <foundation :suit="card.suit" />
        <card-container :card="card" is-foundary :is-draggable="false" />
      </lane>
    </template>

    <template #tableau>
      <!-- tableau piles (7) -->
      <lane
        v-for="(card, key) in tableau"
        :key="key"
      >
        <card-container :card="card" is-foundary is-fannable :is-draggable="false" />
      </lane>
    </template>

    <!-- points/clock -->
    <template #stats>
      <stats
        :points="points"
        :time-elapsed="seconds"
        :is-paused="isPaused"
      />
    </template>

    <!-- action buttons -->
    <template #actions>
      <action-button @click="newGame" :icon="faLayerGroup" :disabled="isPaused">Deal</action-button>
      <action-button @click="start" v-if="isPaused" :icon="faPlay">Resume</action-button>
      <action-button @click="stop" v-else :icon="faPause">Pause</action-button>
      <action-button @click="undo" :disabled="!canUndo" :icon="faReply">Undo</action-button>
      <action-button @click="revealHint" :disabled="!canShowHints" :icon="faLightbulb">Hint</action-button>
      <action-button @click="autoplayGame" v-if="canAutocomplete" :icon="faMagicWandSparkles">Autoplay</action-button>
    </template>
  </game>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { faLightbulb, faMagicWandSparkles, faReply, faPause, faPlay, faLayerGroup } from '@fortawesome/free-solid-svg-icons'
import { useStore } from '@/store/main'
import { storeToRefs } from 'pinia'
import CardContainer from './CardContainer.vue'
import DeckContainer from './DeckContainer.vue'
import ActionButton from '@/components/ActionButton.vue'
import Stats from '@/components/Stats.vue'
import Foundation from '@/components/Foundation.vue'
import Lane from '@/components/Lane.vue'
import Game from '@/components/Game.vue'
import { overrideAnimation } from '@/utils/overrideAnimation'

const store = useStore()
const { tableau, foundations, isComplete, canUndo, canShowHints, canAutocomplete, seconds, points } = storeToRefs(store)
const { newGame, start, stop, autoplayGame } = store
const isPaused = computed(() => store.isStopped && !store.isComplete)

/** Undo the last move. */
function undo() {
  overrideAnimation(() => {
    store.undo()
  })
}

/** Reveals a hint for the next possible move. */
function revealHint() {
  overrideAnimation(() => {
    store.revealHint()
  })
}
</script>
