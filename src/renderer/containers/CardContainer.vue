<template>
  <card-draggable
    :is-ready="ready"
    :is-space="isSpace">
    <highlight :descendant-count="descendants.length" />
    <card
      v-if="!isSpace"
      :suit="card.suit"
      :rank="card.rank"
      :revealed="card.revealed"
      :card-id="card.id"
      @click="revealCard(card.id)"
    />
    <container
      v-if="!unturned"
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
import { mapActions } from 'vuex'
import { Container } from 'vue-smooth-dnd'
import Card from '@/components/Card'
import CardContainer from './CardContainer'
import CardDraggable from '@/components/CardDraggable'
import Highlight from '@/components/Highlight'
import getDescendants from '@/utils/getDescendants'
import isDescendant from '@/utils/isDescendant'

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
      return getDescendants(this.card)
    },
    unturned () {
      return this.card.child === null && !this.card.revealed
    }
  },
  methods: {
    isAncestor (card) {
      let parent = this.$parent
      let ancestors = []

      while (parent) {
        if (parent.$props && parent.$props.card) {
          if (parent.$props.card.id === card.id) {
            return true
          }
          ancestors.push(parent)
        }
        parent = parent.$parent
      }
      return false
    },
    shouldAcceptDrop ({ getChildPayload }) {
      const { child, revealed, isSpace, isPlayed } = this.card
      const card = getChildPayload()

      if (!isPlayed || !card.revealed) {
        return false
      } else if (child) {
        return child.id === card.id
      } else if (isSpace) {
        return true
      } else {
        return !this.isAncestor(card) && revealed
      }
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
    ...mapActions(['moveCard', 'revealCard'])
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
