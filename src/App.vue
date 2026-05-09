<template>
  <felt @click="clearSelections">
    <game-container />
  </felt>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from './store/main'
import Felt from './components/Felt.vue'
import GameContainer from './containers/GameContainer.vue'
import { overrideAnimation } from './utils/overrideAnimation'

export default defineComponent({
  name: 'App',
  components: {
    Felt,
    GameContainer
  },
  setup () {
    const store = useStore()
    const { clearSelections } = store

    if (!Object.keys(store.cards).length) {
      store.newGame()
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
      clearSelections
    }
  }
})
</script>
