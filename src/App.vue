<template>
  <div id="app">
    <space-row :spaces="tableau" />
    <space-row :spaces="foundations" />
  </div>
</template>

<script>
import { Container } from 'vue-smooth-dnd'
import { mapGetters, mapState } from 'vuex'
import Card from './components/Card'
import SpaceRow from './components/SpaceRow'

// import Builder from './components/Builder.vue'

export default {
  name: 'app',
  components: {
    // Builder,
    Card,
    Container,
    SpaceRow
  },
  computed: {
    ...mapGetters(['tableau', 'foundations']),
    ...mapState(['cards'])
  },
  beforeCreate () {
    this.$store.dispatch('newGame')
  },
  methods: {
    getChildPayload () {
      return 'parent'
    }
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
