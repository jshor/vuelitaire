<template>
  <!-- the main template of the card -->
  <div
    ref="containerRef"
    class="card"
    :class="{
      'card--animate': isAnimating,
      'card--foundary': isFoundary,
      'card--fannable-mid': isFannable && !card.revealed,
      'card--fannable-full': isFannable && card.revealed,
      'card--dealable': isDealable,
      'card--error': hasError
    }"

    :key="card.id"
    @touchstart="onTouchStart"
    @mousedown="onMouseDown"
    @dblclick="onDoubleClick"
    @animationend="onShakeEnd"
    @animationcancel="onShakeEnd"
    v-show="!isDragging"
  >
    <div class="card__inner">
      <!-- the visual of the card -->
      <div
        class="card__display"
        :class="{
          'card__display--revealed': card.revealed
        }"
        ref="cardRef"
        @click="onClick"
      >
        <div v-if="(isFoundary && isDealable) || !card.suit" />
        <empty-space v-else-if="isFoundary" />
        <template v-else>
          <!-- cards with rank less than 0 are placeholders and do not have backs -->
          <card-back v-show="card.rank >= 0" />
          <card-front :suit="card.suit" :rank="card.rank" />
        </template>
        <card-highlight v-if="isHighlighted" />
      </div>
    </div>

    <!-- card children (this is also the "droppable" area to receive new cards on top) -->
    <div class="card__child" ref="childRef" :data-id="card.id">
      <slot name="default" />
    </div>

    <Teleport to="body">
      <!-- teleported version of the card: activated when card is being dragged -->
      <div
        v-if="isDragging"
        class="card"
        :class="{
          'card--animate': isAnimating,
          'card--draggable': isDragging,
          'card--fannable-mid': isFannable && !card.revealed,
          'card--fannable-full': isFannable && card.revealed,
        }"
        :key="card.id"
        @transitionend="onAnimationEnd"
        @transitioncancel="onAnimationEnd"
        :style="style"
      >
        <div class="card__inner">
          <!-- the visual of the card -->
          <div
            class="card__display"
            :class="{
              'card__display--revealed': card.revealed
            }"
            ref="cardRef"
            @click="onClick"
          >
            <card-back v-show="card.rank >= 0" />
            <card-front :suit="card.suit" :rank="card.rank" />
            <card-highlight v-if="isHighlighted" />
          </div>
        </div>

        <!-- card children (for display only during dragging) -->
        <div class="card__child">
          <slot name="default" />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  StyleValue,
  watch,
} from 'vue'
import { BoundingBox } from '@/types/BoundingBox'
import CardBack from './CardBack.vue'
import CardFront from './CardFront.vue'
import CardHighlight from './CardHighlight.vue'
import EmptySpace from './EmptySpace.vue'
import { type Card as CardType } from '@/types/Card'
import { Hotspot } from '@/types/Hotspot'
import { Teleportation } from '@/types/Teleportation'
import { getLargestOverlappingCard } from '@/utils/getLargestOverlappingCard'
import { overrideAnimation } from '@/utils/overrideAnimation'

const props = defineProps<{
  card: CardType
  isFoundary?: boolean
  isFannable?: boolean
  isDealable?: boolean
  isSelected?: boolean
  hasError?: boolean
  hotspots: Hotspot[]
  teleportation?: Teleportation
}>()

let offset = { x: 0, y: 0 }
let origin = { x: 0, y: 0 }
let isDragStarted = false
let isTouched = false
let hasEmittedDragStart = false
let el: HTMLElement | undefined
let teleportationId: string | undefined

const hotspot = ref<Hotspot>()
const isDragging = ref(false)
const isAnimating = ref(false)
const containerRef = ref<HTMLElement>()
const cardRef = ref<HTMLElement>()
const childRef = ref<HTMLElement>()
const coords = ref({ x: 200, y: 200 })
const style = computed<StyleValue>(() => ({
  left: `${coords.value.x - offset.x}px`,
  top: `${ coords.value.y - offset.y}px`,
  zIndex: 1
}))
const isHighlighted = computed(() => {
  return props.isSelected || hotspot.value?.card.id === props.card.id
})

const emit = defineEmits<{
  (e: 'dragStart'): void
  (e: 'drag', boundingBox: BoundingBox): void
  (e: 'dragEnd'): void
  (e: 'drop', cardId: string): void
  (e: 'select'): void
  (e: 'autoplay'): void
  (e: 'shaken'): void
}>()

defineExpose({ getHotspot })

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('touchmove', onTouchMove)
  window.addEventListener('mouseup', onMouseUp)
  window.addEventListener('touchend', onTouchEnd)

})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('touchmove', onTouchMove)
  window.removeEventListener('mouseup', onMouseUp)
  window.removeEventListener('touchend', onTouchEnd)
})

watch(() => props.teleportation, onTeleportation)

function onTouchStart($event: TouchEvent) {
  $event.stopPropagation()
  $event.preventDefault()

  onDragStart({
    x: $event.touches[0].clientX,
    y: $event.touches[0].clientY
  })
  isTouched = true
}

function onTouchMove($event: TouchEvent) {
  $event.stopPropagation()
  $event.preventDefault()

  if (!isTouched) return

  onDrag({
    x: $event.touches[0].clientX,
    y: $event.touches[0].clientY
  })
}

function onTouchEnd($event: TouchEvent) {
  $event.stopPropagation()
  $event.preventDefault()

  if (!isTouched) return

  if (isDragging.value) {
    onDragEnd()
  } else {
    emit('autoplay')
  }

  isTouched = false
}

function onDoubleClick ($event: MouseEvent) {
  $event.stopPropagation()
  $event.preventDefault()

  if (!isDragging.value) {
    emit('autoplay')
  }
}

function onMouseDown ($event: MouseEvent) {
  $event.stopPropagation()
  $event.preventDefault()
  onDragStart($event)
}

function onMouseMove ($event: MouseEvent) {
  $event.stopPropagation()
  $event.preventDefault()
  onDrag($event)
}

function onMouseUp ($event: MouseEvent) {
  $event.stopPropagation()
  $event.preventDefault()
  onDragEnd()
}

/**
 * User-intended click (or tap) event handler.
 */
function onClick ($event: MouseEvent) {
  $event.stopPropagation()
  $event.preventDefault()

  // emit('select') // TODO: this conflicts with double click
}

function onShakeEnd() {
  emit('shaken')
}

/**
 * User-dragging start event handler.
 */
function onDragStart ({ x, y }: { x: number, y: number }) {
  if (isDragStarted || !cardRef.value) return

  isDragStarted = true
  hasEmittedDragStart = false

  const bbox = cardRef.value.getBoundingClientRect()

  offset = {
    x: x - bbox.x,
    y: y - bbox.y
  }
  origin = { x: bbox.x, y: bbox.y }
}

/**
 * User-dragging movement event handler.
 */
function onDrag ({ x, y }: { x: number, y: number }) {
  if (!isDragStarted || !cardRef.value) return

  coords.value.x = x
  coords.value.y = y

  const getDelta = (c: 'x' | 'y') => Math.abs(coords.value[c] - (offset[c] + origin[c]))
  const boundingBox = cardRef.value.getBoundingClientRect()

  if (getDelta('x') + getDelta('y') >= 1) {
    isDragging.value = true

    overrideAnimation(() => {
      // sufficient movement has been made to consider this a valid dragging operation
      if (!hasEmittedDragStart) {
        emit('dragStart')
        hasEmittedDragStart = true
      }

      emit('drag', boundingBox)
    })
  }

  computePossibleHotspot(boundingBox)
}

/**
 * User-dragging termination event handler.
 */
async function onDragEnd () {
  if (!isDragStarted) {
    // isDragging.value = false
    isDragStarted = false
    return
  }

  isDragStarted = false

  if (!isDragging.value) {
    // the card was never substantially dragged; reset all coordinates
    offset = { x: 0, y: 0 }
    origin = { x: 0, y: 0 }
    coords.value = { x: 0, y: 0 }
    isDragging.value = false
    return
  }

    isAnimating.value = true

    if (hotspot.value) {
      // the termination of the drag operation landed on a hotspot
      const bbox = hotspot.value.dropSpot

      // compute remaining coordinates for the card to animate onto that hotspot
      coords.value.x = bbox.left
      coords.value.y = bbox.top
    } else {
      // the card will be returned back to its original location
      coords.value.x = origin.x
      coords.value.y = origin.y
    }

    // reset the offset coordinates of the card
    offset = { x: 0, y: 0 }
}

/**
 * Movement animation termination event handler.
 */
function onAnimationEnd() {
  emit('dragEnd')

  // remove the ghost element
  el?.remove()
  el = undefined

  if (teleportationId) {
    // the card was teleported to a new location; reset teleportation state
    emit('drop', teleportationId)
    teleportationId = undefined
  } else if (isAnimating.value && hotspot.value) {
    // the card was dropped from the user dragging it onto a hotspot
    emit('drop', hotspot.value.card.id)
  }

  isAnimating.value = false
  isDragging.value = false
}

/**
 * Computes a possible hotspot for which the card could be dropped onto if released.
 */
function computePossibleHotspot (currentBoundingBox: BoundingBox) {
  hotspot.value = getLargestOverlappingCard(currentBoundingBox, props.hotspots)
}

/**
 * Returns the active hotspot for this card.
 */
function getHotspot(): Hotspot | undefined {
  if (!childRef.value || !containerRef.value) return

  const highlightSpot = containerRef.value.getBoundingClientRect()
  const dropSpot = childRef.value.getBoundingClientRect()

  return { card: props.card, highlightSpot, dropSpot}
}

/**
 * Animates the card from its current parent to its new one.
 */
async function onTeleportation(teleportation?: Teleportation) {
  if (teleportation?.fromId !== props.card.id) return

  const to = document.querySelector<HTMLElement>(`[data-id="${teleportation.toId}"]`)
  const from = containerRef.value

  if (!from || !to) return

  teleportationId = teleportation.toId

  overrideAnimation(() => {
    const toBbox = to.getBoundingClientRect()
    const fromBbox = from.getBoundingClientRect()

    // instantly teleport card to the new location
    origin.x = toBbox.x
    origin.y = toBbox.y

    isDragging.value = true
    coords.value.x = fromBbox.x
    coords.value.y = fromBbox.y

    // animate the card "back" to its "original location" (i.e., the new spot)
    setTimeout(() => {
      isAnimating.value = true
      coords.value.x = origin.x
      coords.value.y = origin.y
    })
  })
}
</script>

<style lang="scss">
.card {
  text-align: center;
  width: var(--card-width);
  height: var(--card-height);
  font-family: system-ui;

  &--error {
    animation: shake 250ms cubic-bezier(.36,.07,.19,.97) forwards;
  }

  &__inner {
    position: relative;
    height: 100%;
  }

  &__display {
    position: absolute;
    width: 100%;
    height: 100%;
    transition: transform var(--animation-speed);
    box-sizing: border-box;
    transform-style: preserve-3d;

    &--revealed {
      transform: rotateY(180deg);
    }
  }

  &__child {
    position: absolute;
    height: 100%;
    top: 0;
    left: 0;
  }

  &--fannable-mid > .card__child {
    top: calc(var(--card-fanning-space) / 2);
  }

  &--fannable-full > .card__child {
    top: var(--card-fanning-space);
  }

  &--foundary > .card__child {
    top: 0;
  }

  &--dealable > .card__child {
    left: calc(-1 * var(--card-fanning-space));
    animation: deal var(--animation-speed) forwards;
  }

  &--dealable span {
    text-orientation: sideways;
    transform: rotate(-90deg) translate(-50%, -65px);
    display: block;
  }

  &--draggable {
    position: absolute;
  }

  &--animate {
    transition: all var(--animation-speed);
  }
}

@keyframes deal {
  0% {
    left: 0;
  }
  100% {
    left: var(--card-fanning-space);
  }
}

@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>
