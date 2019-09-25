<template>
  <div class="deck">
    <div
      v-for="card in waste"
      :key="card.id"
      :style="{
        paddingLeft: `${getFannedPadding(card)}px`
      }"
      class="deck__card">
      <container
        :get-child-payload="() => card"
        :should-accept-drop="shouldAcceptDrop.bind(null, card)"
        :should-animate-drop="() => false"
        orientation="horizontal"
        group-name="right">
        <card-container
          :key="card.id"
          :card="card"
          :has-child="card.child !== null"
        />
      </container>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { Container } from 'vue-smooth-dnd'
import CardContainer from '@/containers/CardContainer'

export default {
  name: 'Deck',
  components: {
    CardContainer,
    Container
  },
  computed: {
    ...mapState({
      waste: state => state.deck.waste,
      dealt: state => state.deck.dealt
    })
  },
  methods: {
    shouldAcceptDrop ({ id }, { getChildPayload }) {
      // the only time a card in the waste should accept a child is when a card is being returned
      return id === getChildPayload().id
    },
    getFannedPadding (card) {
      // the top 2 cards (last n-1 cards) of the dealt pile should be horizontally fanned with padding
      const index = this.dealt.findIndex(({ id }) => id === card.id)

      return Math.max(index * 20, 0)
    }
  }
}
</script>

<style>
.deck, .deck__card {
  position: absolute;
}
</style>
