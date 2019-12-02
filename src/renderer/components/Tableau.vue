<template>
  <div class="tableau">
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class Tableau extends Vue {}
</script>

<style lang="scss">
.tableau {
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: row-reverse;
  width: 100%;
}

.tableau .card-container {
  margin-top: $card-fanning-space;
  box-sizing: border-box;
}

.tableau .card-container:not(.card-container--revealed) {
  margin-top: $card-fanning-space / 2;
}

.tableau > .card-draggable > .card-container {
  margin-top: 0;
}
</style>
