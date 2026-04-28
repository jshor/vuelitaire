<template>
  <div class="radio-group">
    <div
      v-for="data in values"
      :key="data.value">
      <input
        :name="name"
        :checked="data.value === modelValue"
        :id="`${name}_${data.value}`"
        @change="$emit('input', data.value)"
        type="radio"
      />
      <label
        :for="`${name}_${data.value}`"
        class="radio-group__label">
        {{ data.label }}
      </label>
    </div>
  </div>
</template>

<script lang="ts" generic="T" setup>
defineProps<{
  name: string
  values: {
    label: string
    value: T
  }[]
  modelValue: T
}>()
</script>

<style lang="scss">
.radio-group {
  &__label {
    cursor: pointer;
  }
}
</style>
