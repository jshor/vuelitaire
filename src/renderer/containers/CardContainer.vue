<template>
  <card-draggable
    :is-ready="ready || hint.includes(card.id)"
    :is-space="isSpace">
    <!-- TODO: highlight may not be necessary -->
    <highlight :descendant-count="descendants.length" />
    <card
      v-if="!isSpace"
      :suit="card.suit"
      :rank="card.rank"
      :revealed="card.revealed"
      :card-id="card.id"
      @click="canReveal && revealCard(card.id)"
    />
    <container
      v-if="!canReveal"
      class="card-container"
      orientation="horizontal"
      group-name="right"
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
  </card-draggable>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { Container } from 'vue-smooth-dnd'
import Card from '@/components/Card'
import CardContainer from './CardContainer'
import CardDraggable from '@/components/CardDraggable'
import Highlight from '@/components/Highlight'
import getLineage from '@/utils/getLineage'
import isDescendant from '@/utils/isDescendant'
import isAncestor from '@/utils/isAncestor'

export default {
  name: 'CardContainer',
  components: {
    Card,
    CardDraggable,
    CardContainer,
    Container,
    Highlight
  },
  data () {
    return { ready: false }
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
      return getLineage(this.card)
    },
    canReveal () {
      return this.card.child === null && !this.card.revealed
    },
    ...mapGetters(['hint'])
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
    ...mapActions([
      'moveCard',
      'revealCard'
    ])
  }
}
</script>

<style>
.card-container {
  width: 10vw;
  min-height: calc(14vw - 20px);
  box-sizing: border-box;
}
</style>
