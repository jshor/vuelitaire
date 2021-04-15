<template>
  <div class="modal">
    <div class="modal__content">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class Modal extends Vue {}
</script>

<style lang="scss">
.modal {
  background-color: rgba(0,0,0,0.5);
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1010;
  cursor: default;

  &__content {
    max-width: 500px;
    width: 100%;
    padding: 1rem;
    box-sizing: border-box;
    font-family: "Segoe UI", Helvetica, Arial, system-ui, sans-serif;
    font-size: 0.8rem;
    color: #222222;
    text-shadow: 1px 1px 1px #fff;
    background-color: #e8e8e8;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    display: flex;
    flex-direction: column;
    border-radius: 1px;
    animation: 0.5s modal-in forwards;
  }
}

@keyframes modal-in {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
