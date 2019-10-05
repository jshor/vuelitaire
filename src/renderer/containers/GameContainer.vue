<template>
  <div class="game">
    <div class="game__top">
      <foundations>
        <div
          class="game__spacer game__spacer--deal"
          :class="{ 'game__spacer--active': hint.includes('DEAL_CARD') }"
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
    <button @click="undo" :disabled="!canUndo">Undo</button>
    <button @click="showHint">Hint</button>
    <button @click="newGame">New Game</button>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import DeckContainer from './DeckContainer'
import CardContainer from './CardContainer'
import Foundations from '../components/Foundations'
import Tableau from '../components/Tableau'

export default {
  name: 'app',
  components: {
    CardContainer,
    DeckContainer,
    Foundations,
    Tableau
  },
  computed: {
    ...mapGetters(['tableau', 'foundations', 'hint', 'canUndo']),
    ...mapState({
      cards: state => state.game.cards
    })
  },
  beforeCreate () {
    this.$store.dispatch('newGame')
  },
  methods: {
    ...mapActions(['newGame', 'deal', 'showHint', 'undo'])
  }
}
</script>

<style>
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
