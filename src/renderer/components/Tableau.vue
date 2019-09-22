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
  justify-content: space-around;
  align-items: center;
  width: 100%;
}

.tableau .card-container {
  margin-top: 20px;
}

.tableau > .card-draggable > .card-container {
  margin-top: 0;
}
</style>
