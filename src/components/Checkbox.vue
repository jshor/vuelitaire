<template>
  <div class="checkbox">
    <input
      :name="name"
      :value="modelValue"
      :checked="modelValue"
      :id="id"
      @change="$emit('input', $event.target.checked)"
      type="checkbox"
    />
    <label
      :for="id"
      class="checkbox__label">
      {{ label }}
    </label>
  </div>
</template>

<script lang="ts" setup>
import { computed, withDefaults, defineProps } from 'vue'

const props = withDefaults(defineProps<{
  label?: string
  name: string
  modelValue: boolean
}>(), {
  label: ' '
})

const id = computed(() => `${props.name}_${props.modelValue}`)
</script>

<style lang="scss">
.checkbox {
  &__label {
    cursor: pointer;
  }
}
</style>
