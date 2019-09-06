<template>
  <div class="flexo">
    <div 
      v-for="space in spaces"
      :key="space.id"
      class="foundation">
      <card :card="space" />
    </div>
  </div>
</template>

<script>
import Card from './Card'

export default {
  name: 'SpaceRow',
  components: { Card },
  props: {
    spaces: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
.flexo {

  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.foundation {
}
</style>