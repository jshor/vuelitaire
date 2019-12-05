<template>
  <div class="radio-group">
    <div
      v-for="data in values"
      :key="data.value">
      <input
        :name="name"
        :checked="data.value === value"
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

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'RadioGroup',
  props: {
    name: {
      type: String,
      required: true
    },
    values: {
      type: Array,
      default: []
    },
    value: {
      required: true
    }
  }
})
export default class RadioGroup extends Vue {}
</script>

<style lang="scss">
.radio-group {
  &__label {
    cursor: pointer;
  }
}
</style>
