<template>
  <div class="gallery">
    <div
      v-for="(backface, key) in backfaces"
      :class="{ 'gallery__card--selected': key === value }"
      :key="key"
      @click="$emit('input', key)"
      class="gallery__card">
      <card-back :backface="backface" />
    </div>
  </div>
</template>

<script lang="ts">
import { CardBacks } from '@/constants'
import IBackface from '@/interfaces/IBackface'
import Vue from 'vue'
import Component from 'vue-class-component'
import CardBack from './CardBack.vue'

@Component({
  name: 'Stats',
  components: { CardBack },
  props: ['value']
})
export default class Gallery extends Vue {
  public backfaces: IBackface = CardBacks
}
</script>

<style lang="scss">
.gallery {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  box-sizing: border-box;
  border: 1px solid #808080;
  margin-top: 1rem;

  &__card {
    width: $card-width;
    height: $card-height;
    margin: 0.5rem;
    box-sizing: border-box;
    position: relative;
    cursor: pointer;

    &::after {
      position: absolute;
      bottom: 0.35rem;
      right: 0.35rem;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
      opacity: 0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
      background-color: green;
      color: #fff;
      content: '✓';
      font-size: 0.75em;
      text-shadow: none;
      transition: 0.25s all;
    }

    &:hover, &--selected {
      .card-back {
        border: 3px solid green;
      }
    }

    &--selected {
      &::after {
        opacity: 1;
      }
    }
  }
}
</style>
