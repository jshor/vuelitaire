<template>
  <div class="game" @click="clearSelection">
    <div
      v-if="animation.inProgress || stats.isComplete"
      class="animation-cover"
    />
    <div class="game__top">
      <foundations>
        <empty-space
          data-id="DEAL_CARD"
          :class="{
            'game__spacer--active': highlightedCards.includes('DEAL_CARD')
          }"
          @click="deal">
          <card-back :backface="backface" v-if="deck.stock.length" />
          <empty-stock-icon v-else />
        </empty-space>
        <div class="game__spacer game__spacer--deck"  data-id="WASTE_PILE">
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

    <div class="game__action-bar">
      <div class="game__action-bar--left">
        <stats-container />
      </div>
      <div class="game__action-bar--right" v-if="!stats.isComplete">
        <action-button @click="autoComplete(0)" v-if="stats.canAutocomplete">
          <i class="fas fa-magic" />
          Auto
        </action-button>
        <action-button @click="undo" :disabled="!canUndo" v-else>
          <i class="fas fa-reply" />
          Undo
        </action-button>
        <action-button @click="showHint">
          <i class="fas fa-lightbulb" />
          Hint
        </action-button>
        <action-button @click="newGame">
          <i class="fas fa-layer-group" />
          Deal
        </action-button>
        <action-button @click="toggleDialog(true)">
          <i class="fas fa-cog" />
          Settings
        </action-button>
      </div>
    </div>

    <settings-container v-if="settings.showDialog" />

    <winner
      :is-complete="stats.isComplete"
      @redeal="newGame"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { mapActions, mapGetters, mapState } from 'vuex'

import ActionButton from '@/components/ActionButton.vue'
import AnimatedCard from '@/components/AnimatedCard.vue'
import Card from '@/components/Card.vue'
import CardBack from '@/components/CardBack.vue'
import EmptySpace from '@/components/EmptySpace.vue'
import EmptyStockIcon from '@/components/EmptyStockIcon.vue'
import Foundations from '@/components/Foundations.vue'
import Modal from '@/components/Modal.vue'
import Tableau from '@/components/Tableau.vue'
import Winner from '@/components/Winner.vue'
import CardContainer from './CardContainer.vue'
import DeckContainer from './DeckContainer.vue'
import SettingsContainer from './SettingsContainer.vue'
import StatsContainer from './StatsContainer.vue'

import { CardBacks } from '@/constants'

import IAnimationState from '@/interfaces/IAnimationState'
import ICard from '@/interfaces/ICard'
import IBackface from '../interfaces/IBackface'
import ISettingsState from '../interfaces/ISettingsState'

@Component({
  computed: {
    ...mapState('deck/cards', [
      'tableau',
      'foundations'
    ]),
    ...mapGetters([
      'highlightedCards',
      'canUndo'
    ]),
    ...mapGetters('settings', [
      'backface'
    ]),
    ...mapState([
      'animation',
      'stats',
      'settings',
      'deck'
    ])
  },
  methods: {
    ...mapActions('hints', [
      'showHint'
    ]),
    ...mapActions('settings', [
      'toggleDialog'
    ]),
    ...mapActions([
      'deal',
      'newGame',
      'undo',
      'clearSelection',
      'autoComplete'
    ])
  },
  components: {
    ActionButton,
    AnimatedCard,
    Card,
    CardBack,
    CardContainer,
    DeckContainer,
    EmptySpace,
    EmptyStockIcon,
    Foundations,
    Modal,
    Tableau,
    StatsContainer,
    SettingsContainer,
    Winner
  }
})
class GameContainer extends Vue {
  public tableau: ICard[]

  public foundations: ICard[]

  public highlightedCards: string[]

  public canUndo: boolean

  public animation: IAnimationState

  public settings: ISettingsState

  public newGame: () => Promise<void>

  public beforeCreate () {
    this.$store.dispatch('init')
  }

  get backface (): IBackface {
    return CardBacks[this.settings.backfaceId]
  }
}

export default GameContainer
</script>

<style lang="scss">
.empty-deck {
  background-color: transparent;
}

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
  width: 100vmin;
  margin: auto;
}

.game__top {
  margin: 2rem 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.game__spacer {
  margin-top: 0;
  width: $card-width;
  height: $card-height;
  box-sizing: border-box;
}

.game__spacer--deal {
  z-index: 1000;
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

.game__action-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  margin: 0.5rem;

  &--left, &--right {
    display: flex;
    align-items: center;
    flex: 1;
  }

  &--right {
    justify-content: flex-end;
  }
}

@media screen and (max-width: 600px) {
  .game__action-bar {
    flex-direction: column;

    &--left {
      text-align: center;
    }

    &--right {
      > * {
        flex: 1;
      }
    }
  }
}
</style>
