<template>
  <div class="stats">
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'Stats',
  props: {
    theme: {
      type: String,
      default: 'green'
    }
  }
})
export default class Stats extends Vue {
  public theme: string
}
</script>

<style lang="scss">
.stats {
  font-family: "Segoe UI", Helvetica, Arial, system-ui, sans-serif;
  font-size: 1rem;
  padding: 0.5rem;
  color: #fff;
  text-shadow: 1px 1px 1px #000;
}
</style>
