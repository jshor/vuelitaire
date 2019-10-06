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
  flex-direction: row-reverse;
  width: 100%;
}

.tableau .card-container {
  margin-top: 20px;
  box-sizing: border-box;
}

.tableau > .card-draggable > .card-container {
  margin-top: 0;
}
</style>
