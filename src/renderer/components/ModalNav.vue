<template>
  <ul class="modal-nav">
    <li
      v-for="key in sections"
      :key="key"
      :class="{ 'modal-nav__link--active': value === key }"
      @click="$emit('input', key)"
      class="modal-nav__link"
    >{{ key }}</li>
    <li
      @click="$emit('close')"
      class="modal-nav__close">
      <i class="fas fa-times" />
    </li>
  </ul>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  props: ['value', 'sections']
})
export default class Modal extends Vue {}
</script>

<style lang="scss">
.modal-nav {
  list-style: none;
  display: inline-flex;
  margin: 0;
  padding: 0;
  font-weight: bold;

  &__link {
    margin: 0;
    margin-right: 2rem;
    color: #000;
    cursor: pointer;

    &::after {
      content: ' ';
      display: block;
      width: 0;
      height: 3px;
      background-color: #286e2e;
      transition: 0.25s all;
      margin: 0.5rem auto 0;
    }

    &:hover, &--active {
      color: #286e2e;

      &::after {
        width: 100%;
      }
    }

    &--active {
      cursor: default;
    }
  }

  &__close {
    margin-left: auto;
    cursor: pointer;
    font-size: 1rem;
    transition: 0.25s color;

    &:hover {
      color: #666;
    }
  }
}
</style>
