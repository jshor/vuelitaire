<template>
  <div class="app">
    <div class="app__game" @click="clearSelections">
      <game-container />
      <congratulations :is-active="isComplete" @end="newGame" />
    </div>
    <div class="app__actions">
      <stats-container />
      <button @click="undo" :disabled="!canUndo">Undo</button>
      <button @click="revealHint">revealHint</button>
      <button @click="autoplayGame" :disabled="!canAutocomplete">autoplayGame</button>
    </div>
  </div>
</template>

<script lang="ts">
import { storeToRefs } from 'pinia'
import { defineComponent } from 'vue'
import { useStore } from './store/main'
import GameContainer from './containers/GameContainer.vue'
import StatsContainer from './containers/StatsContainer.vue'
import Congratulations from './components/Congratulations.vue'
import { overrideAnimation } from './utils/overrideAnimation'

export default defineComponent({
  name: 'App',
  components: {
    Congratulations,
    GameContainer,
    StatsContainer
  },
  setup () {
    const store = useStore()
    const { canUndo, canAutocomplete, isComplete } = storeToRefs(store)
    const { undo, deal, revealHint, clearSelections, autoplayGame, newGame } = store

    if (!Object.keys(store.cards).length) {
      newGame()
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
      canUndo,
      canAutocomplete,
      isComplete,
      newGame,
      undo,
      deal,
      revealHint,
      clearSelections,
      autoplayGame

    }
  }
})
</script>

<style lang="scss">
:root {
  --animation-speed: 1000ms;
  --card-width: 10vmin;
  --card-height: 14vmin;
  --card-fanning-space: 2vmin;
}

#app {
  width: 100vw;
  height: 100vh;
}

.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  max-width: 100vmin;
  width: 100%;

  &__game {
    flex: 1;
  }
}

body {
  user-select: none;
  padding: 0;
  margin: 0;
}

body, html {
  height: 100%;
  padding: 0;
  margin: 0;
  touch-action: none;
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
