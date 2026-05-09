<template>
  <div class="empty-space" @click="$emit('click')">
    <slot />
  </div>
</template>

<style lang="scss">
.empty-space {
  position: absolute;
  width: var(--card-width);
  height: var(--card-height);
  box-sizing: border-box;
  box-sizing: border-box;
  border: 2px solid rgba(255,255,255,0.4);
  border-radius: 3px;
}
</style>
