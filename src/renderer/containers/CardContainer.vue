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
        @drag-enter="onDragEnter"
        @drag-leave="onDragLeave"
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

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Container } from 'vue-smooth-dnd'
import { mapActions, mapGetters } from 'vuex'

import Card from '../components/Card.vue'
import CardDraggable from '../components/CardDraggable.vue'
import BaseModel from '../store/models/BaseModel'
import Pair from '../store/models/Pair'
import getDescendants from '../utils/getLineage'
import isAncestor from '../utils/isAncestor'
import isDescendant from '../utils/isDescendant'

@Component({
  props: {
    card: {
      type: Object as () => BaseModel,
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
    ])
  },
  components: {
    Card,
    CardDraggable,
    CardContainer,
    Container
  },
  methods: {
    ...mapActions([
      'moveCard',
      'setSelection'
    ])
  }
})
class CardContainer extends Vue {
  public name: string = 'CardContainer'

  public card: BaseModel

  public hasChild: boolean

  public isSpace: boolean

  public highlightedCards: string[]

  public ready: boolean = false

  public error: boolean = false

  public moveCard: (pair: Pair) => Promise<void>

  public setSelection: (card: BaseModel) => Promise<void>

  get descendants (): BaseModel[] {
    return getDescendants(this.card)
  }

  get canReveal (): boolean {
    return this.card.child === null && !this.card.revealed
  }

  get isHighlighted (): boolean {
    return (this.ready || this.highlightedCards.includes(this.card.id)) && this.card.revealed
  }

  public shouldAcceptDrop ({ getChildPayload }: { getChildPayload: () => BaseModel }) {
    const parent: BaseModel = this.card
    const card: BaseModel = getChildPayload()

    if (parent.child) {
      // if the child card is being returned, always accept it
      return parent.child.id === card.id
    }
    return !isAncestor(this.$parent, card) && parent.canAcceptCard(card)
  }

  public onDragEnter (): void {
    this.ready = true
  }

  public onDragLeave (): void {
    this.ready = false
  }

  public onDrop ({ payload }: { payload: any }) {
    if (!this.ready) { return }

    if (!isDescendant(this.card, payload.id)) {
      this.moveCard(new Pair(payload.id, this.card.id))
    }
    this.ready = false
  }

  public selectCard (autoplay: boolean): void {
    const card: BaseModel = this.card.child || this.card

    if (!this.ready && card.revealed) {
      if (autoplay) {
        this.autoplayCard(card)
      } else {
        this.setSelection(card)
      }
    }
  }

  public autoplayCard (card: BaseModel): void {
    this.ready = false
    this.error = true
  }
}

export default CardContainer
</script>

<style>
.card-container,
.card-container__inner {
  width: 10vw;
  min-height: calc(14vw - 20px);
  box-sizing: border-box;
}
</style>
