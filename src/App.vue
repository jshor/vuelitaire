<template>
  <div id="app">
    <game-container />
  </div>
</template>

<script lang="ts">
import GameContainer from './containers/GameContainer'

export default {
  name: 'app',
  components: { GameContainer }
}
</script>

<style>
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

.game-cont {
}
</style>
