<template>
  <div class="tableau">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Tableau',
});
</script>

<style lang="scss">
.tableau {
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: row-reverse;
  width: 100%;
}

.tableau .card-container {
  margin-top: var(--card-fanning-space);
  box-sizing: border-box;
}

.tableau .card-container:not(.card-container--revealed) {
  margin-top: calc(var(--card-fanning-space) / 2);
}

.tableau > .empty-space > .card-container {
  margin-top: 0;
}
</style>
