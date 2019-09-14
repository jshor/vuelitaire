<template>
  <card-draggable :is-ready="ready">
    <highlight :descendant-count="descendants.length" />
    <card
      :suit="card.suit"
      :rank="card.rank"
    />
    <Container
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
    </Container>
  </card-draggable>
</template>

<script>
import { mapActions } from 'vuex'
import { Container } from 'vue-smooth-dnd'
import Card from './Card'
import CardContainer from './CardContainer'
import CardDraggable from './CardDraggable'
import Highlight from './Highlight'
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
    }
  },
  computed: {
    descendants () {
      return getDescendants(this.card)
    }
  },
  methods: {
    ...mapActions(['moveCard']),
    canAccept (id) {
      return this.card.child === null || this.card.child.id === id.id
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
          console.log('will move')
          this.moveCard({ cardId, targetId })
        }
        this.ready = false
      }
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
