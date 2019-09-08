<template>
  <div class="highlight">
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
    }
  }
}
</script>

<style>
.highlight {
  width: 100px;
  position: absolute;
  box-shadow: 0px 0 10px green;
  display: none;
  margin-left: -1px;
  border-radius: 3px;
}

.highlight__body {
  height: 150px;
}

.highlight__descendant {
  height: 20px;
}
</style>
