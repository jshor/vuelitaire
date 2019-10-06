<template>
  <card-draggable
    :is-highlighted="isHighlighted"
    :is-space="isSpace"
    :card-id="card.id">
    <card
      v-if="!isSpace"
      :animation-index="card.animationIndex"
      :suit="card.suit"
      :rank="card.rank"
      :revealed="card.revealed"
      :card-id="card.id"
      :error="error"
    />
    <div
      @click.stop="selectCard(false)"
      @dblclick.stop="selectCard(true)"
      class="card-container">
      <container
        v-if="!canReveal"
        class="card-container__inner"
        orientation="horizontal"
        group-name="right"
        non-drag-area-selector=".card:not(.card--revealed)"
        @drop="onDrop"
        @drag-enter="() => ready = true"
        @drag-leave="() => ready = false"
        :get-child-payload="() => card.child"
        :should-accept-drop="shouldAcceptDrop">
        <card-container
          v-if="card.child && hasChild"
          :card="card.child"
          :has-child="card.child !== null"
        />
      </container>
    </div>
  </card-draggable>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { Container } from 'vue-smooth-dnd'
import Card from '@/components/Card'
import CardContainer from './CardContainer'
import CardDraggable from '@/components/CardDraggable'
import getDescendants from '@/utils/getLineage'
import isDescendant from '@/utils/isDescendant'
import isAncestor from '@/utils/isAncestor'

export default {
  name: 'CardContainer',
  components: {
    Card,
    CardDraggable,
    CardContainer,
    Container
  },
  data () {
    return { ready: false, error: false }
  },
  props: {
    card: {
      type: Object,
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
    descendants () {
      return getDescendants(this.card)
    },
    canReveal () {
      return this.card.child === null && !this.card.revealed
    },
    isHighlighted () {
      return (this.ready || this.highlightedCards.includes(this.card.id)) && this.card.revealed
    },
    ...mapGetters([
      'highlightedCards'
    ])
  },
  methods: {
    shouldAcceptDrop ({ getChildPayload }) {
      const parent = this.card
      const card = getChildPayload()

      if (parent.child) {
        // if the child card is being returned, always accept it
        return parent.child.id === card.id
      }
      return !isAncestor(this.$parent, card) && parent.canAcceptCard(card)
    },
    onDrop ({ payload }) {
      if (!this.ready) return

      const cardId = payload.id
      const targetId = this.card.id

      if (!isDescendant(this.card, cardId)) {
        this.moveCard({ cardId, targetId })
      }
      this.ready = false
    },
    selectCard (autoplay) {
      const card = this.card.child || this.card

      if (!this.ready && card.revealed) {
        if (autoplay) {
          this.autoplayCard(card)
        } else {
          this.setSelection(card)
        }
      }
    },
    autoplayCard () {
      this.ready = false
      this.error = true
    },
    ...mapActions([
      'moveCard',
      'setSelection'
    ])
  }
}
</script>

<style>
.card-container,
.card-container__inner {
  width: 10vw;
  min-height: calc(14vw - 20px);
  box-sizing: border-box;
}
</style>
