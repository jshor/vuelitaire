<template>
  <div class="deck">
    <button @click="deal">Deal</button>
    <div
      class="deck__waste"
      :class="`deck__waste--${dealCount}`">
      <Container
        v-for="card in waste"
        :key="card.id"
        :get-child-payload="() => card"
        :should-accept-drop="shouldAcceptDrop.bind(null, card)"
        :should-animate-drop="() => false"
        :style="{ 'padding-left': `${padding(card)}px` }"
        orientation="horizontal"
        group-name="right"
        class="deck__card">
        <card-container
          :key="card.id"
          :card="card"
          :has-child="card.child !== null"
        />
      </Container>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { Container } from 'vue-smooth-dnd'
import CardContainer from './CardContainer'

export default {
  name: 'Deck',
  components: {
    CardContainer,
    Container
  },
  data () {
    return {
      cache: []
    }
  },
  computed: {
    ...mapState({
      waste: state => state.deck.waste,
      dealt: state => state.deck.dealt,
      dealCount: state => state.deck.dealCount
    })
  },
  methods: {
    shouldAcceptDrop ({ id }, { getChildPayload }) {
      return id === getChildPayload().id
    },
    deal () {
      this.$store.commit('DEAL')
    },
    padding (card) {
      const index = this.dealt.findIndex(({ id }) => id === card.id)

      return Math.max(index * 20, 0)
    }
  }
}
</script>

<style>
.deck__waste {
  position: relative;
}

.deck__card {
  position: absolute;
}

.deck__card .card-draggable {
  top: 0;
}
</style>
