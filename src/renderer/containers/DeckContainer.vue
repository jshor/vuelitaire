<template>
  <div class="deck">
    <div
      v-for="card in waste"
      :key="card.id"
      :class="{
        'deck__card--second': isNth(card, 1),
        'deck__card--third': isNth(card, 2)
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

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Container } from 'vue-smooth-dnd'
import { mapState } from 'vuex'

import ICard from '../interfaces/ICard'
import CardContainer from './CardContainer.vue'

@Component({
  components: {
    CardContainer,
    Container
  },
  computed: {
    ...mapState('deck', [
      'waste',
      'dealt'
    ])
  }
})
class DeckContainer extends Vue {
  public dealt: ICard[]

  public shouldAcceptDrop ({ id }: ICard, { getChildPayload }): boolean {
    // the only time a card in the waste should accept a child is when a card is being returned
    return id === getChildPayload().id
  }

  public isNth (card: ICard, n: number): boolean {
    return this.dealt.findIndex(({ id }: ICard) => id === card.id) === n
  }
}

export default DeckContainer
</script>

<style lang="scss">
.deck, .deck__card {
  position: absolute;
}

.deck__card {
  .card-draggable:not(.card-draggable--ready) {
    animation-duration: 1s;
    animation-fill-mode: forwards;
    animation-name: outer-card-glow-out;

    .card__front,
    .card__back {
      animation-duration: 1s;
      animation-fill-mode: forwards;
      animation-name: inner-card-glow-out;
    }
  }
}


@keyframes outer-card-glow-out {
  from {
    box-shadow: 0px 0 30px orange;
  }
  to {
    box-shadow: none;
  }
}

@keyframes inner-card-glow-out {
  from {
    box-shadow: inset 0px 0 30px orange;
  }
  to {
    box-shadow: none;
  }
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
