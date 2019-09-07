<template>
  <Draggable class="card" :class="{
    'card--ready': ready
    }">
    <div class="card-detail">
      {{ card.rank }} {{ card.suit }} {{ card.id.substring(0, 3) }}
    </div>
    <Container
      class="card__child"
      orientation="horizontal"
      group-name="right"
      @drop="onDrop"
      @drag-enter="onDragEnter"
      @drag-leave="onDragLeave"
      :should-accept-drop="shouldAcceptDrop"
      :animation-duration="500"
      :get-child-payload="getChildPayload">
      <card
        v-if="card.child"
        :card="cards.child"
        :parent-id="card.id"
        :has-child="card.child !== null"
      />
    </Container>
  </Draggable>
</template>

<script>
import { Container, Draggable } from 'vue-smooth-dnd'
import Card from './Card'

export default {
  name: 'Card',
  components: { Card, Container, Draggable },
  data () {
    return {
      ready: false
    }
  },
  props: {
    card: {
      type: Object,
      default: null
    },
    parentId: {
      type: String,
      default: null
    },
    isAbsolute: {
      type: Boolean,
      default: false
    },
    hasChild: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    canAccept (id) {
      return this.card.child === null || this.card.child.id === id
    },
    shouldAcceptDrop (stuff) {
      return this.canAccept(stuff.getChildPayload())
    },
    onDrop (dropResult) {
      if (this.ready) {
        this.ready = false
        const cardId = dropResult.payload
        const targetId = this.card.id
        
      
        console.log('drop result: ', dropResult.payload.substring(0,3), this.card.id.substring(0,3))
        this.$store.commit('MOVE_CARD', { cardId, targetId })
      }
    },
    getChildPayload () {
      return this.card.child.id
    },
    onDragEnter () {
      this.ready = true
    },
    onDragLeave () {
      this.ready = false
    }
  }
}
</script>

<style scoped>
.card {
  display: block;
  width: 100px;
  height: 150px;
  background-color: lightblue;
  border: 1px solid #c0c0c0;
  box-sizing: border-box;
  background-color: #fff;
  top: 20px;
  left: -1px;
  position: relative;
  border-radius: 3px;
  font: 12px Arial, Helvetica, sans-serif;
  transition-duration: 0s !important;
}

.card.smooth-dnd-ghost {
  margin-top: 20px;
  margin-left: -1px;
}

.card.smooth-dnd-ghost.animated {
  transition-duration: 250ms !important;
}

.card-detail {
  position: absolute;
  width: 100px;
  height: 150px;
}

.card-detail__inner {
  position: absolute;
  width: 100px;
  height: 150px;
}

.card--ready {
  box-shadow: 0px 0 3px red;
}

.card__desc {
  font-size: 0.2rem;
  font-family: Arial, Helvetica, sans-serif;
}

.card__inner {
  border: 1px solid red;
  box-sizing: border-box;
}

.card__child {
  width: 100px;
  min-height: 150px;
  height: 100%;
}

</style>
