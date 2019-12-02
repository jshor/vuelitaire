<template>
  <div class="foundations">
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class Foundations extends Vue {}
</script>

<style>
.foundations {
  display: flex;
  justify-content: space-around;
  align-items: center;
  align-items: center;
  width: 100%;
}
</style>
