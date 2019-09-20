<template>
  <card-draggable :is-ready="ready" :is-space="isSpace">
    <div @click="reveal">
      <highlight :descendant-count="descendants.length" />
      <card
        :suit="card.suit"
        :rank="card.rank"
        :revealed="card.revealed"
        :is-space="isSpace"
      />
    </div>
    <container
      v-if="!unturned"
      class="card-container"
      orientation="horizontal"
      group-name="right"
      @drop="onDrop"
      @drag-enter="() => ready = true"
      @drag-leave="() => ready = false"
      :get-child-payload="() => card.child"
      :should-accept-drop="shouldAcceptDrop"
      :should-animate-drop="shouldAnimateDrop">
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
import Card from '../components/Card'
import CardContainer from './CardContainer'
import CardDraggable from '../components/CardDraggable'
import Highlight from '../components/Highlight'
import getDescendants from '../utils/getDescendants'
import isDescendant from '../utils/isDescendant'

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
    ...mapActions(['moveCard']),
    canAccept (card) {
      return (this.card.child === null || this.card.child.id === card.id) && card.revealed
    },
    shouldAcceptDrop ({ getChildPayload }) {
      return this.canAccept(getChildPayload())
    },
    shouldAnimateDrop (opts, payload) {
      return !isDescendant(payload, this.card.id)
    },
    onDrop ({ payload }) {
      if (this.ready) {
        const cardId = payload.id
        const targetId = this.card.id

        if (!isDescendant(payload, targetId)) {
          this.moveCard({ cardId, targetId })
        }
        this.ready = false
      }
    },
    reveal () {
      this.card.revealed = true
    }
  }
}
</script>

<style>
.card-container {
  width: 100px;
  min-height: 150px;
  height: 100%;
}
</style>
