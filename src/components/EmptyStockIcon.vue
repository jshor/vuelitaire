<template>
  <div class="empty-stock-icon" />
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class EmptyStockIcon extends Vue {}
</script>

<style lang="scss">
.empty-stock-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  &::after {
    content: ' ';
    width: 50%;
    padding-bottom: 50%;
    border-radius: 50%;
    border: 1vmin solid rgba(255,255,255,0.4);
  }
}
</style>
