<template>
  <div id="app">
    <deck />
    <space-row :spaces="tableau" />
    <space-row :spaces="foundations" :is-stacked="true" />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import SpaceRow from './components/SpaceRow'
import Deck from './components/Deck'

export default {
  name: 'app',
  components: {
    Deck,
    SpaceRow
  },
  computed: {
    ...mapGetters(['tableau', 'foundations']),
    ...mapState(['cards'])
  },
  beforeCreate () {
    this.$store.dispatch('newGame')
  }
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
}
</style>
