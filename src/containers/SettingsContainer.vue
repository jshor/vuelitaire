<template>
  <modal>
    <modal-nav
      v-model="activeSection"
      :sections="sections"
      @close="toggleDialog(false)"
    />

    <div
      v-if="activeSection === 'Game'"
      class="settings__content">
      <div class="settings__panel">
        <h3>Solitaire variation</h3>

        <radio-group
          v-model="userSettings.dealCount"
          :values="[
            { value: 1, label: 'Draw One' },
            { value: 3, label: 'Draw Three' }
          ]"
          name="drawType"
        />
      </div>

      <div class="settings__panel">
        <h3>Solitaire variation</h3>
        <checkbox
          v-model="userSettings.showScore"
          name="showScore"
          label="Show game score"
        />

        <checkbox
          v-model="userSettings.showTimer"
          name="showTimer"
          label="Show game timer"
        />

        <checkbox
          v-model="userSettings.autoplayWhenClicked"
          name="autoplayWhenClicked"
          label="Autoplay cards when clicked"
        />
      </div>

      <div class="settings__info">Changes to variation will be applied during the next deal.</div>
    </div>

    <div
      v-else-if="activeSection === 'Appearance'"
      class="settings__content">
      <gallery v-model="userSettings.backfaceId" />
    </div>

    <div
      v-else
      class="settings__content">
      About...
    </div>
  </modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapState } from 'vuex';
import Checkbox from '@/components/Checkbox';
import Gallery from '@/components/Gallery';
import Modal from '@/components/Modal';
import ModalNav from '@/components/ModalNav';
import RadioGroup from '@/components/RadioGroup';

export default defineComponent({
  name: 'SettingsContainer',
  components: {
    Gallery,
    Checkbox,
    Modal,
    ModalNav,
    RadioGroup
  },
  computed: {
    ...mapState(['settings'])
  },
  methods: {
    ...mapActions('settings', ['updateSettings', 'toggleDialog'])
  },
  watch: {
    userSettings: {
      handler() {
        this.updateSettings(this.userSettings);
      },
      deep: true
    }
  },
  data() {
    return {
      userSettings: {
        ...this.$store.state.settings
      },
      sections: ['Game', 'Appearance', 'About'],
      activeSection: 'Game'
    };
  }
});
</script>

<style lang="scss">
.settings {
  &__content {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }

  &__panel {
    width: 50%;
    display: flex;
    flex-direction: column;
  }

  &__info {
    font-size: 0.75rem;
    margin-top: 1.5rem;
    width: 100%;
  }
}

@media screen and (max-width: 500px) {
  .settings__content {
    flex-direction: column;
  }
}
</style>
