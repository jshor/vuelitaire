<template>
  <div
    :style="outerStyle.asStyle()"
    class="animated-card">
    <div
      :style="innerStyle.asStyle()"
      class="animated-card__inner"
      ref="card"
    />
  </div>
</template>

<script>
import getScreenCoordinates from '@/utils/getScreenCoordinates'

export default {
  props: {
    cardId: {
      type: String,
      default: null
    },
    targetId: {
      type: String,
      default: null
    }
  },
  methods: {
    /**
     * Clones the card DOM element to allow it to move freely (position: absolute).
     * Sets the original card DOM element to be invisible.
     */
    cloneCard (id) {
      const elem = document.querySelector(`[data-id="${id}"]`)
      const card = this.$refs.card

      if (elem) {
        card.appendChild(elem.cloneNode(true))
        elem.style.opacity = 0
      } else {
        card.innerHTML = ''
      }
    }
  },
  computed: {
    /**
     * Computes absolute positioning using the screen coordinates of the original element.
     *
     * @returns {ScreenPoint}
     */
    outerStyle () {
      return getScreenCoordinates(`[data-id="${this.cardId}"]`)
    },

    /**
     * Computes positioning relative to the target, for animation purposes.
     *
     * @returns {ScreenPoint}
     */
    innerStyle () {
      const sel = `[data-id="${this.targetId}"]`

      return getScreenCoordinates(`
        ${sel}.smooth-dnd-ghost .card-container,
        ${sel} .card-container,
        ${sel}.game__spacer
      `).diff(this.outerStyle)
    }
  },
  watch: {
    cardId (id) {
      this.cloneCard(id)
    }
  }
}
</script>

<style lang="scss">
.animated-card {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
}

.animated-card__inner {
  position: relative;
  top: 0;
  left: 0;
  transition-duration: 250ms;
  transition-property: top, left;
}

.animated-card__inner .card-container {
  margin-top: $card-fanning-space;
}

.animated-card__inner > .card-draggable > .card {
  margin-top: -$card-fanning-space;
}

/* disable highlighting */
.animated-card .animated-card__inner div {
  box-shadow: none;
}
</style>
