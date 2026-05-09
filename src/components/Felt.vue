<template>
  <div class="felt">
    <slot />
  </div>
</template>

<style lang="scss">
.felt {
  width: 100vw;
  height: 100vh;
  background: rgb(2,201,2);
  background: radial-gradient(circle, rgba(2,201,2,1) 0%, rgba(3,121,19,1) 100%);
}
</style>
