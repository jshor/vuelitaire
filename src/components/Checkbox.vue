<template>
  <div class="checkbox">
    <input
      :name="name"
      :value="modelValue"
      :checked="modelValue"
      :id="id"
      @change="onChange"
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
import { computed } from 'vue'

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const props = withDefaults(defineProps<{
  label?: string
  name: string
  modelValue: boolean
}>(), {
  label: ' '
})

const id = computed(() => `${props.name}_${props.modelValue}`)

function onChange(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}
</script>

<style lang="scss">
.checkbox {
  &__label {
    cursor: pointer;
  }
}
</style>
