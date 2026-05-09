<template>
  <button
    class="action-button action-button--green"
    :disabled="disabled">
    <FontAwesomeIcon class="action-button__icon" v-if="icon" :icon="icon" />
    <span class="action-button__content">
      <slot />
    </span>
  </button>
</template>

<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { IconDefinition } from '@fortawesome/free-solid-svg-icons'

defineProps<{
  theme?: string,
  disabled?: boolean
  icon?: IconDefinition
}>()
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
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  cursor: pointer;
  transition: all 0.25s;
  white-space: nowrap;

  &__icon {
    @media (max-width: 480px) {
      font-size: 7vmin;
    }
  }

  @media (max-width: 480px) {
    width: 100%;
  }

  &__content {
    margin-left: 0.25rem;

    @media (max-width: 480px) {
      display: none;
    }
  }

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
