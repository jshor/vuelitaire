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
        :non-drag-area-selector="nonDragSelector"
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
import { isMobile } from 'is-mobile'
import { defineComponent } from 'vue';
import { Container } from 'vue-smooth-dnd';
import { mapState } from 'vuex';
import ICard from '@/interfaces/ICard';
import CardContainer from './CardContainer';

export default defineComponent({
  name: 'DeckContainer',
  components: { Container, CardContainer },
  computed: {
    ...mapState('deck', [
      'waste',
      'dealt'
    ]),
    nonDragSelector(): string {
      if (this.isMobile) {
        return '.card-container';
      }
      return '.card:not(.card--revealed)';
    }
  },
  data() {
    return {
      isMobile: isMobile()
    };
  },
  methods: {
    isNth(card: ICard, n: number) {
      return this.dealt.findIndex(({ id }: ICard) => id === card.id) === n;
    },
    shouldAcceptDrop({ id }: ICard, { getChildPayload }) {
      return id === getChildPayload().id;
    }
  },
});
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

@keyframes fanning-first {
  from {
    padding-left: 0;
  }
  to {
    padding-left: 0;
    margin-left: 0px;
  }
}

@keyframes fanning-second {
  from {
    padding-left: 0;
  }
  to {
    padding-left: calc(var(--card-fanning-space));
    margin-left: 0px;
  }
}

@keyframes fanning-third {
  from {
    padding-left: 0;
  }
  to {
    padding-left: calc(var(--card-fanning-space) * 2);
    margin-left: 0px;
  }
}
</style>
