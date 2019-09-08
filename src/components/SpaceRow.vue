<template>
  <div class="space-row">
    <card-container
      v-for="space in spaces"
      :key="space.id"
      :card="space"
      :has-child="space.child !== null"
      :class="{ 'space-row__space--stacked': isStacked }"
      class="space-row__space"
    />
  </div>
</template>

<script>
import CardContainer from './CardContainer'

export default {
  name: 'SpaceRow',
  components: { CardContainer },
  props: {
    spaces: {
      type: Array,
      default: () => []
    },
    isStacked: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style>
.space-row {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.space-row__space
  > .card-container
  > .card-draggable {
  top: -1px;
}

.space-row__space--stacked
  .card-container
  .card-draggable {
  top: -1px;
}
</style>
