<template>
  <div class="foundations">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Foundations'
}
</script>

<style>
.foundations {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.foundations
  .card-draggable
  .card-container
  .card-draggable {
  top: -1px;
}
</style>
