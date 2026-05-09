<template>
  <div class="app">
    <div class="app__game"  :class="{
      'app__game--paused': isPaused
    }" @click="clearSelections">
      <game-container />
      <congratulations :is-active="isComplete" @end="newGame" />
    </div>
    <action-bar>
      <template #stats>
        <stats
          :points="points"
          :time-elapsed="seconds"
          :is-paused="isPaused"
        />
      </template>

      <action-button @click="newGame" :icon="faLayerGroup" :disabled="isPaused">Deal</action-button>
      <action-button @click="start" v-if="isPaused" :icon="faPlay">Resume</action-button>
      <action-button @click="stop" v-else :icon="faPause">Pause</action-button>
      <action-button @click="undo" :disabled="!canUndo" :icon="faReply">Undo</action-button>
      <action-button @click="revealHint" :disabled="!canShowHints" :icon="faLightbulb">Hint</action-button>
      <action-button @click="autoplayGame" v-if="canAutocomplete" :icon="faMagicWandSparkles">Autoplay</action-button>
    </action-bar>
  </div>
</template>

<script lang="ts">
import { storeToRefs } from 'pinia'
import { computed, defineComponent } from 'vue'
import { faLightbulb, faMagicWandSparkles, faReply, faPause, faPlay, faLayerGroup } from '@fortawesome/free-solid-svg-icons'
import { useStore } from './store/main'
import GameContainer from './containers/GameContainer.vue'
import Congratulations from './components/Congratulations.vue'
import ActionBar from './components/ActionBar.vue'
import ActionButton from './components/ActionButton.vue'
import Stats from './components/Stats.vue'
import { overrideAnimation } from './utils/overrideAnimation'

export default defineComponent({
  name: 'App',
  components: {
    Congratulations,
    GameContainer,
    Stats,
    ActionBar,
    ActionButton
  },
  setup () {
    const store = useStore()
    const { canUndo, canShowHints, canAutocomplete, isComplete, seconds, points } = storeToRefs(store)
    const { clearSelections, autoplayGame, newGame, start, stop } = store
    const isPaused = computed(() => store.isStopped && !store.isComplete)

    if (!Object.keys(store.cards).length) {
      newGame()
    }

    function undo() {
      overrideAnimation(() => {
        store.undo()
      })
    }

    function revealHint() {
      overrideAnimation(() => {
        store.revealHint()
      })
    }

    // set animation speed
    document
      .documentElement
      .style
      .setProperty('--animation-speed', `${250}ms`)

    let resizeTimer = 0

    // immediately end any active animations when the window is resized
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer)

      resizeTimer = setTimeout(() => {
        overrideAnimation(() => clearTimeout(resizeTimer))
      })
    })

    return {
      faMagicWandSparkles, faReply, faPause, faPlay, faLayerGroup,
      faLightbulb,
      canUndo,
      canShowHints,
      canAutocomplete,
      isComplete,
      isPaused,
      seconds,
      points,
      newGame,
      undo,
      revealHint,
      clearSelections,
      autoplayGame,
      start,
      stop
    }
  }
})
</script>

<style lang="scss">
:root {
  --animation-speed: 250ms;
  --card-width: 12vmin;
  --card-height: calc(var(--card-width) * 1.4);
  --card-fanning-space: 5vmin;
  --card-border-radius: 0.5vmin;
}

@media (min-width: 960px) {
  :root {
    --card-fanning-space: 4vmin;
  }
}

#app {
  width: 100vw;
  height: 100vh;
}

.app {
  padding: 0 1vmin;
  box-sizing: border-box;
  height: 100vh;
  flex-direction: column;
  max-width: 100vmin;
  width: 100%;
  transform: filter var(--animation-speed);
  touch-action: none;

  &__game {
    width: 100%;
    height: 100%;

    &--paused {
      filter: blur(1vmin);
    }
  }
}

body {
  user-select: none;
  padding: 0;
  margin: 0;
  overflow: hidden;
}

body, html {
  height: 100%;
  padding: 0;
  margin: 0;
  user-select: none;
}

#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  align-items: center;
  justify-content: space-between;
  background: rgb(2,201,2);
  background: radial-gradient(circle, rgba(2,201,2,1) 0%, rgba(3,121,19,1) 100%);
}
</style>
