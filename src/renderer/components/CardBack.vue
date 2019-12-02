<template>
  <div class="card-back">
    <i class="fas fa-chess" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class CardBack extends Vue {}
</script>

<style lang="scss">
.card-back {
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  box-sizing: border-box;
  border-radius: 3px;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border: 1px solid #000;
  background: linear-gradient(135deg, #184e68 0%,#57ca85 100%);
  color: #e8e8e8;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-shadow: 1px 1px 1px #000;
}
</style>
