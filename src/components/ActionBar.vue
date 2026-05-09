<template>
  <div class="action-bar">
    <div class="action-bar__stats">
      <slot name="stats" />
    </div>

    <div class="action-bar__actions">
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
.action-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;

  &__stats {
    flex: 1;
  }

  &__actions {
    display: flex;
    padding: 0.5vmin;
  }

  @media (max-width: 480px) {
    flex-direction: column;
  }
}
</style>
