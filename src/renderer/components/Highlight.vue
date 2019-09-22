<template>
  <div class="highlight" :class="{ 'highlight--active': active }">
    <div
      v-for="i in descendantCount - 1"
      :key="i"
      class="highlight__descendant"
    />
    <div class="highlight__body" />
  </div>
</template>

<script>
export default {
  name: 'Highlight',
  props: {
    descendantCount: {
      type: Number,
      default: 0
    },
    active: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style>
.highlight {
  width: 10vw;
  position: absolute;
  box-sizing: border-box;
  border-radius: 3px;
  box-shadow: 0;
  transition: 0.2s box-shadow;
}

.highlight--active {
  box-shadow: 0px 0 30px orange;
}

.highlight__body {
  height: 14vw;
}

.highlight__descendant {
  height: 20px;
}
</style>
