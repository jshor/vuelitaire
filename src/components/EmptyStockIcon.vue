<template>
  <div class="empty-stock-icon" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EmptyStockIcon',
});
</script>

<style lang="scss">
.empty-stock-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  &::after {
    content: ' ';
    width: 50%;
    padding-bottom: 50%;
    border-radius: 50%;
    border: 1vmin solid rgba(255,255,255,0.4);
  }
}
</style>
