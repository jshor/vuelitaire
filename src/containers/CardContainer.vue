<template>
  <card-draggable
    :is-highlighted="isHighlighted"
    :is-space="isSpace"
    :card-id="card.id">
    <card
      v-if="!isSpace"
      :animation-index="card.animationIndex"
      :revealed="card.revealed"
      :error="card.hasError">
      <card-back :backface="backface" />
      <card-front
        :suit="card.suit"
        :rank="card.rank"
      />
    </card>
    <div
      @click.stop="selectCard(false)"
      @dblclick.stop="selectCard(true)"
      :class="{ 'card-container--revealed': card.revealed }"
      class="card-container">
      <container
        v-if="!canReveal"
        class="card-container__inner"
        orientation="horizontal"
        group-name="right"
        @drop="onDrop"
        @drag-enter="onDragEnter"
        @drag-leave="onDragLeave"
        :non-drag-area-selector="nonDragSelector"
        :get-child-payload="() => card.child"
        :should-accept-drop="shouldAcceptDrop"
        :drag-begin-delay="0">
        <card-container
          v-if="card.child && hasChild"
          :card="card.child"
          :has-child="card.child !== null"
        />
      </container>
    </div>
  </card-draggable>
</template>

<script lang="ts">
import { isMobile } from 'is-mobile'
import { defineComponent } from 'vue';
import { Container } from 'vue-smooth-dnd';
import { mapActions, mapGetters } from 'vuex';
import Card from '@/components/Card';
import CardBack from '@/components/CardBack';
import CardDraggable from '@/components/CardDraggable';
import CardFront from '@/components/CardFront';
import ICard from '@/interfaces/ICard';
import Pair from '@/models/Pair';
import getDescendants from '@/utils/getLineage';
import isAncestor from '@/utils/isAncestor';
import isDescendant from '@/utils/isDescendant';

export default defineComponent({
  name: 'CardContainer',
  props: {
    card: {
      type: Object as () => ICard,
      default: null
    },
    hasChild: {
      type: Boolean,
      default: false
    },
    isSpace: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters([
      'highlightedCards'
    ]),
    ...mapGetters('settings', [
      'backface'
    ]),

    nonDragSelector (): string {
      if (this.isMobile) {
        return '.card-container'
      }
      return '.card:not(.card--revealed)'
    },
    descendants (): ICard[] {
      return getDescendants(this.card)
    },
    canReveal (): boolean {
      return this.card.child === null && !this.card.revealed
    },
    isHighlighted (): boolean {
      return (this.ready || this.highlightedCards.includes(this.card.id)) && this.card.revealed
    },
  },
  components: {
    Card,
    CardBack,
    CardDraggable,
    CardFront,
    Container
  },
  data() {
    return {
      ready: false,
      error: false,
      isMobile: isMobile()
    };
  },
  methods: {
    ...mapActions([
      'moveCard',
      'setSelection',
      'autoplayCard'
    ]),
    shouldAcceptDrop ({ getChildPayload }: { getChildPayload: () => ICard }) {
      const parent: ICard = this.card
      const card: ICard = getChildPayload()

      if (parent.child) {
        // if the child card is being returned, always accept it
        return parent.child.id === card.id
      }
      return !isAncestor(this.$parent, card) && parent.canAcceptCard(card)
    },
    onDragEnter (): void {
      this.ready = true
    },
    onDragLeave (): void {
      this.ready = false
    },
    onDrop ({ payload }: { payload: ICard }): void {
      if (!this.ready) {
        return
      }

      if (!isDescendant(this.card, payload.id)) {
        this.moveCard(new Pair(payload.id, this.card.id))
      }
      this.ready = false
    },
    selectCard (autoplay: boolean): void {
      const card: ICard = this.card.child || this.card

      if (!this.ready && card.revealed) {
        if (autoplay || this.isMobile) {
          this.autoplayCard(card)
        } else {
          this.setSelection(card)
        }
      }
    }
  }
});
</script>

<style lang="scss">
.card-container,
.card-container__inner {
  width: var(--card-width);
  min-height: calc(#{var(--card-height)} - #{var(--card-fanning-space)});
  box-sizing: border-box;
}
</style>
