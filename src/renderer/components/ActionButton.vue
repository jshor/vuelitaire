<template>
  <button
    :class="`action-button action-button--${theme}`"
    :disabled="disabled"
    @click.stop="$emit('click')">
    <slot />
  </button>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'ActionButton',
  props: {
    theme: {
      type: String,
      default: 'green'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
})
export default class Button extends Vue {
  public theme: string
}
</script>

<style lang="scss">
.action-button {
  border: 0;
  border-bottom-width: 5px;
  border-bottom-style: solid;
  font-family: "Segoe UI", Helvetica, Arial, system-ui, sans-serif;
  font-size: 0.85rem;
  padding: 0.5rem;
  margin: 0.5rem;
  border-radius: 0.25rem;
  text-shadow: 1px 1px 1px #000;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  cursor: pointer;
  transition: all 0.25s;
  white-space: nowrap;

  &--green {
    background-color: #3eaf47;
    border-bottom-color: #286e2e;
    color: #fff;

    &:active {
      background-color: #133315;
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }

  &:hover:not(:disabled) {
    box-shadow: 0px 0 30px orange;
  }
}
</style>
