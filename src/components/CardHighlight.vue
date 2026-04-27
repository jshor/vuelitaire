<template>
  <div class="highlight">
    <div class="highlight__inner" />
  </div>
</template>

<style lang="scss">
.highlight {
  box-shadow: 0 0 30px orange;
  position: absolute;
  width: var(--card-width);
  height: var(--card-height);

  &__inner {
    box-shadow: inset 0 0 30px orange;
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>
