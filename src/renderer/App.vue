<template>
  <div id="app">
    <deck-container />
    <tableau>
      <card-container
        v-for="space in tableau"
        :key="space.id"
        :card="space"
        :is-space="true"
        :has-child="space.child !== null"
      />
    </tableau>
    <foundations>
      <card-container
        v-for="space in foundations"
        :key="space.id"
        :card="space"
        :is-space="true"
        :has-child="space.child !== null"
      />
    </foundations>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import DeckContainer from '@/containers/DeckContainer'
import CardContainer from '@/containers/CardContainer'
import Foundations from '@/components/Foundations'
import Tableau from '@/components/Tableau'

export default {
  name: 'app',
  components: {
    CardContainer,
    DeckContainer,
    Foundations,
    Tableau
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
