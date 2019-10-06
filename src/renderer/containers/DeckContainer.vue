<template>
  <div class="deck">
    <div
      v-for="card in waste"
      :key="card.id"
      :class="{
        'deck__card--second': isNth(card, 1),
        'deck__card--third': isNth(card, 2)
      }"
      style="margin-left: -30px"
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
import CardContainer from './CardContainer'

export default {
  name: 'Deck',
  components: {
    CardContainer,
    Container
  },
  computed: {
    ...mapState('deck', [
      'waste',
      'dealt'
    ])
  },
  methods: {
    shouldAcceptDrop ({ id }, { getChildPayload }) {
      // the only time a card in the waste should accept a child is when a card is being returned
      return id === getChildPayload().id
    },
    isNth (card, n) {
      return this.dealt.findIndex(({ id }) => id === card.id) === n
    }
  }
}
</script>

<style lang="scss">
.deck, .deck__card {
  position: absolute;
}

.deck__card {
  animation: fanning-first 250ms forwards;
}

.deck__card--second {
  animation: fanning-second 250ms forwards;
}

.deck__card--third {
  animation: fanning-third 250ms forwards;
}

@include fanning-deck-card('first', 0px);
@include fanning-deck-card('second', 20px);
@include fanning-deck-card('third', 40px);
</style>
