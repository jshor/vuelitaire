<template>
  <div class="empty-space" />
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class EmptySpace extends Vue {}
</script>

<style lang="scss">
.empty-space {
  width: $card-width;
  height: $card-height;
  border-width: 5px;
  border-style: solid;
  box-sizing: border-box;
  background-color: #000;
}
</style>
