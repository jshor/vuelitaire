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
      :error="card.hasError"
    />
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
import Vue from 'vue'
import Component from 'vue-class-component'
import { Container } from 'vue-smooth-dnd'
import { mapActions, mapGetters } from 'vuex'
import { isMobile } from 'is-mobile'

import Card from '@/components/Card.vue'
import CardDraggable from '@/components/CardDraggable.vue'
import ICard from '@/interfaces/ICard'
import Pair from '@/models/Pair'
import getDescendants from '@/utils/getLineage'
import isAncestor from '@/utils/isAncestor'
import isDescendant from '@/utils/isDescendant'

@Component({
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
      'setSelection',
      'autoplayCard'
    ])
  }
})
class CardContainer extends Vue {
  public card: ICard

  public hasChild: boolean

  public isSpace: boolean

  public highlightedCards: string[]

  public ready: boolean = false

  public error: boolean = false

  public isMobile: boolean = isMobile()

  public moveCard: (pair: Pair) => Promise<void>

  public setSelection: (card: ICard) => Promise<void>

  public autoplayCard: (card: ICard) => Promise<void>

  get nonDragSelector (): string {
    if (this.isMobile) {
      return '.card-container'
    }
    return '.card:not(.card--revealed)'
  }

  get descendants (): ICard[] {
    return getDescendants(this.card)
  }

  get canReveal (): boolean {
    return this.card.child === null && !this.card.revealed
  }

  get isHighlighted (): boolean {
    return (this.ready || this.highlightedCards.includes(this.card.id)) && this.card.revealed
  }

  public shouldAcceptDrop ({ getChildPayload }: { getChildPayload: () => ICard }) {
    const parent: ICard = this.card
    const card: ICard = getChildPayload()

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

  public onDrop ({ payload }: { payload: ICard }): void {
    if (!this.ready) {
      return
    }

    if (!isDescendant(this.card, payload.id)) {
      this.moveCard(new Pair(payload.id, this.card.id))
    }
    this.ready = false
  }

  public selectCard (autoplay: boolean): void {
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

export default CardContainer
</script>

<style lang="scss">
.card-container,
.card-container__inner {
  width: $card-width;
  min-height: calc(#{$card-height} - #{$card-fanning-space});
  box-sizing: border-box;
}
</style>
