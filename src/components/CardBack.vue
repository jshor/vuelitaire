<template>
  <div class="card-back" :style="{
    background: 'linear-gradient(135deg, #184e68 0%,#57ca85 100%)'
  }">
  </div>
</template>

<style lang="scss">
.card-back {
  position: absolute;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  box-sizing: border-box;
  border-radius: 3px;
  width: var(--card-width);
  height: var(--card-height);
  backface-visibility: hidden;
  border: 1px solid #000;
  color: #e8e8e8;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-shadow: 1px 1px 1px #000;
}
</style>
