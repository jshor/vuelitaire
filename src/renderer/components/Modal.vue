<template>
  <div class="modal">
    <div class="modal__content">
      <ul class="nav">
        <li class="nav__link nav__link--active">Game</li>
        <li class="nav__link">About</li>
        <li class="nav__close">
          <i class="fas fa-times" />
        </li>
      </ul>
      <div class="settings">
        <div class="settings__content">
          <div class="panel">
            <h3>Solitaire variation</h3>
            <div class="settings__field">
              <input type="radio" class="settings__radio" />
              <label>Draw One</label>
            </div>
            <div class="settings__field">
              <input type="radio" class="settings__radio" />
              <label>Draw Three</label>
            </div>
          </div>

          <div class="panel">
            <h3>Gameplay</h3>
            <div class="settings__field">
              <input type="checkbox" class="settings__radio" />
              <label>Show game timer</label>
            </div>
            <div class="settings__field">
              <input type="checkbox" class="settings__radio" />
              <label>Show game score</label>
            </div>
            <div class="settings__field">
              <input type="checkbox" class="settings__radio" />
              <label>Autoplay cards when clicked</label>
            </div>
          </div>
        </div>

        <div class="settings__info">Changes to variation will be applied during the next deal.</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'Stats',
  props: {
    theme: {
      type: String,
      default: 'green'
    }
  }
})
export default class Modal extends Vue {
}
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

.nav {
  list-style: none;
  display: inline-flex;
  margin: 0;
  padding: 0;
  font-weight: bold;

  &__link {
    margin: 0;
    margin-right: 2rem;
    color: #000;
    cursor: pointer;

    &::after {
      content: ' ';
      display: block;
      width: 0;
      height: 3px;
      background-color: #286e2e;
      transition: 0.25s all;
      margin: 0.5rem auto 0;
    }

    &:hover, &--active {
      color: #286e2e;

      &::after {
        width: 100%;
      }
    }

    &--active {
      cursor: default;
    }
  }

  &__close {
    margin-left: auto;
    cursor: pointer;
    font-size: 1rem;
    transition: 0.25s color;

    &:hover {
      color: #666;
    }
  }
}

.settings {

  &__content {
    display: flex;
    width: 100%;
  }

  &__info {
    font-size: 0.75rem;
    margin-top: 1.5rem;
  }

  &__radio {

  }
}

.panel {
  width: 50%;
  display: flex;
  flex-direction: column;
}


@media screen and (max-width: 500px) {
  .settings__content {
    flex-direction: column;
  }

  .panel {
    // width: 100%;
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
