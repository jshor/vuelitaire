<template>
  <div class="checkbox">
    <input
      :name="name"
      :value="value"
      :checked="value"
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

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'Checkbox',
  props: {
    label: {
      type: String,
      default: ' '
    },
    name: {
      type: String,
      required: true
    },
    value: {
      required: true
    }
  }
})
export default class Checkbox extends Vue {
  public name: string

  public value: string

  get id () {
    return `${this.name}_${this.value}`
  }
}
</script>

<style lang="scss">
.checkbox {
  &__label {
    cursor: pointer;
  }
}
</style>
