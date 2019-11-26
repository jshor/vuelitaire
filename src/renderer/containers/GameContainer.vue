<template>
  <div class="game" @click="clearSelection">
    <div
      v-if="animation.inProgress"
      class="animation-cover"
    />
    <div class="game__top">
      <foundations>
        <div
          data-id="DEAL_CARD"
          class="game__spacer game__spacer--deal"
          :class="{
            'game__spacer--active': highlightedCards.includes('DEAL_CARD')
          }"
          @click="deal"
        />
        <div class="game__spacer game__spacer--deck">
          <deck-container />
        </div>
        <div class="game__spacer" />
        <card-container
          v-for="space in foundations"
          :key="space.id"
          :card="space"
          :is-space="true"
          :has-child="space.child !== null"
        />
      </foundations>
    </div>
    <div class="game__tableau">
      <tableau>
        <card-container
          v-for="space in tableau"
          :key="space.id"
          :card="space"
          :is-space="true"
          :has-child="space.child !== null"
        />
      </tableau>
    </div>

    <animated-card
      :card-id="animation.cardId"
      :target-id="animation.targetId"
    />

    <button @click="undo" :disabled="!canUndo">Undo</button>
    <button @click="showHint">Hint</button>
    <button @click="newGame">New Game</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { mapActions, mapGetters, mapState } from 'vuex'

import AnimatedCard from '../components/AnimatedCard.vue'
import Foundations from '../components/Foundations.vue'
import Tableau from '../components/Tableau.vue'
import CardContainer from './CardContainer.vue'
import DeckContainer from './DeckContainer.vue'

import ICard from '../types/interfaces/ICard'
import { AnimationState } from '../store/modules/animation'

@Component({
  computed: {
    ...mapGetters('deck/cards', [
      'tableau',
      'foundations'
    ]),
    ...mapGetters([
      'highlightedCards',
      'canUndo'
    ]),
    ...mapState([
      'animation'
    ])
  },
  methods: {
    ...mapActions('hints', [
      'showHint'
    ]),
    ...mapActions([
      'deal',
      'newGame',
      'undo',
      'clearSelection'
    ])
  },
  components: {
    AnimatedCard,
    CardContainer,
    DeckContainer,
    Foundations,
    Tableau
  }
})
class GameContainer extends Vue {
  public tableau: ICard[]

  public foundations: ICard[]

  public highlightedCards: string[]

  public canUndo: boolean

  public animation: AnimationState

  public newGame: () => Promise<void>
}

export default GameContainer
</script>

<style>
.animation-cover {
  z-index: 1000;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
.game {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.game__top {
  margin: 2rem 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.game__spacer {
  margin-top: 0;
  width: 10vw;
  height: 14vw;
  box-sizing: border-box;
}

.game__spacer--deal {
  z-index: 1000;
  border: 1px solid #000;
  border-radius: 3px;
  background: repeating-linear-gradient(
    45deg,
    #606dbc,
    #606dbc 10px,
    #465298 10px,
    #465298 20px
  );
}

.game__spacer--active {
  box-shadow: 0px 0 30px orange;
}

.game__spacer--deck {
  position: relative;
}

.game__foundations {
  flex: 1;
}

.game__tableau {
  flex: 1;
}
</style>
