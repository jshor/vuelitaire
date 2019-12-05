<template>
  <div class="card-back" :style="{
    background: backface.background
  }">
    <i :class="`fas fa-${backface.icon}`" />
  </div>
</template>

<script lang="ts">
import { CardBacks } from '@/constants'
import IBackface from '@/interfaces/IBackface'
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  props: {
    backface: {
      type: Object as () => IBackface,
      default: () => CardBacks.A1
    }
  }
})
export default class CardBack extends Vue {}
</script>

<style lang="scss">
.card-back {
  position: absolute;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  box-sizing: border-box;
  border-radius: 3px;
  width: $card-width;
  height: $card-height;
  backface-visibility: hidden;
  border: 1px solid #000;
  color: #e8e8e8;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-shadow: 1px 1px 1px #000;
}
</style>
