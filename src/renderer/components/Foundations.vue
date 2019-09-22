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
  justify-content: space-around;
  align-items: center;
  align-items: center;
  width: 100%;
}
</style>
