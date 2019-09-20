<template>
  <div class="tableau">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Tableau'
}
</script>

<style>
.tableau {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.tableau
  > .card-draggable
  > .card-container
  > .card-draggable {
  top: -1px;
}
</style>
