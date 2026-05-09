<template>
  <card-draggable
    :card="card"
    :hotspots="hotspots"
    :teleportation="teleportation"
    :is-fannable="isFannable"
    :is-foundary="isFoundary"
    :is-dealable="isDealable"
    :is-selected="isSelected"
    :has-error="hasError"
    @drag-start="onDragStart"
    @drag-end="onDragEnd"
    @drag="onCurrentCardDrag"
    @drop="onDrop"
    @select="onSelect"
    @autoplay="onAutoplay"
    @shaken="onShaken"
    ref="draggableRef"
  >
    <card-container
      v-if="card.child"
      :card="card.child"
      :is-fannable="isFannable"
      :is-dealable="isDealable"
    />
  </card-draggable>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { Card } from '@/types/Card'
import { useStore } from '@/store/main'
import CardDraggable from '@/components/CardDraggable.vue'
import { isAncestor } from '@/utils/isAncestor'
import { BoundingBox } from '@/types/BoundingBox'
import { getLargestOverlappingCard } from '@/utils/getLargestOverlappingCard'

const props = withDefaults(defineProps<{
  card: Card,
  isFannable?: boolean,
  isFoundary?: boolean,
  isDealable?: boolean,
  isSelectable?: boolean
}>(), {
  isFannable: false,
  isFoundary: false,
  isDealable: false,
  isSelectable: true
})

const store = useStore()
const { hotspots, teleportation } = storeToRefs(store)
const draggableRef = ref<InstanceType<typeof CardDraggable>>()
const isSelected = computed(() => {
  return store.selectedCardId === props.card.id || store.hoveredCardId === props.card.id || store.currentHint.includes(props.card.id)
})
const hasError = computed(() => store.errorCardId === props.card.id)

watch(() => store.draggedCardId, onExternalCardDrag)

function onAutoplay() {
  store.autoplayCard(props.card.id)
}

function onShaken() {
  if (store.errorCardId === props.card.id) {
    store.errorCardId = undefined
  }
}

/**
 * Event handler for the card being selected by the user.
 */
function onSelect () {
  if (!props.isSelectable) return
  if (store.selectedCardId && store.selectedCardId !== props.card.id) {
    store.moveCard(store.selectedCardId, props.card.id)
  } else {
    store.selectedCardId = props.card.id
  }
}

/**
 * Event handler for active drag movement of **the current** card.
 * This event fires with each pixel movement of the drag operation of this card.
 */
function onCurrentCardDrag(boundingBox: BoundingBox) {
  store.hoveredCardId = getLargestOverlappingCard(boundingBox, store.hotspots)?.card.id
}

/**
 * Event handler for active drag movement of **an external** card (i.e., not this one).
 * This event fires with each pixel movement of the drag operation of an external card.
 */
function onExternalCardDrag (cardId?: string) {
  if (!cardId) return
  if (props.card.child || isAncestor(props.card, cardId)) return

  const hotspot = draggableRef.value?.getHotspot()

  if (hotspot) {
    // add the current card to the list of hotspots, if the target card can accept it
    if (props.card.canAcceptCard(store.cards[cardId])) {
      store.hotspots.push(hotspot)
    }
  }
}

/**
 * Event handler for the start of a user drag operation of a card.
 */
function onDragStart () {
  store.clearSelections()
  store.draggedCardId = props.card.id
}

/**
 * Event handler for the end of a user drag operation of a card.
 */
async function onDragEnd () {
  store.clearSelections()
}

/**
 * Event handler for a card being dropped onto a new one.
 */
async function onDrop (
  /** New parent card ID. */
  nextParentId: string
) {
  const adopterId = store.hoveredCardId || nextParentId

  if (adopterId) {
    store.adoptNewCard(props.card.id, nextParentId)
  }
}
</script>
