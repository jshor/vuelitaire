<template>
  <div id="app">
    <game-container />
  </div>
</template>

<script>
import GameContainer from '@/containers/GameContainer'

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
}

#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: space-between;
  background: rgb(3,121,19);
  background: radial-gradient(circle, rgba(3,121,19,1) 0%, rgba(2,201,2,1) 100%);
}
</style>
