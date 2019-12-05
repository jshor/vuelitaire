<template>
  <div class="congratulations">
    <div class="congratulations__text">you won!</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class Congratulations extends Vue {}
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Luckiest+Guy");

.congratulations {
  font-family: "Luckiest Guy", cursive;
  cursor: default;
  margin-bottom: 2rem;
  display: block;
  text-align: center;

  &__text {
    position: relative;
    top: 20px;
    display: inline-block;
    animation: bounce 0.3s ease infinite alternate;
    font-size: 14vmin;
    color: #fff;
    text-shadow: 0 1px 0 #ccc, 0 2px 0 #ccc, 0 3px 0 #ccc, 0 4px 0 #ccc,
      0 5px 0 #ccc, 0 6px 0 transparent, 0 7px 0 transparent, 0 8px 0 transparent,
      0 9px 0 transparent, 0 10px 10px rgba(0, 0, 0, 0.4);
  }
}

@keyframes bounce {
  100% {
    top: -20px;
    text-shadow: 0 1px 0 #ccc, 0 2px 0 #ccc, 0 3px 0 #ccc, 0 4px 0 #ccc,
      0 5px 0 #ccc, 0 6px 0 #ccc, 0 7px 0 #ccc, 0 8px 0 #ccc, 0 9px 0 #ccc,
      0 50px 25px rgba(0, 0, 0, 0.2);
  }
}
</style>
