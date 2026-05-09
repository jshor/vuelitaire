<template>
  <div class="lane">
    <slot />
  </div>
</template>

<style lang="scss">
.lane {
  display: flex;
  box-sizing: border-box;
  width: var(--card-width);
  flex-direction: column;
  position: relative;

  &--dealt {
    left: calc(-1 * var(--card-fanning-space));
  }
}
</style>
