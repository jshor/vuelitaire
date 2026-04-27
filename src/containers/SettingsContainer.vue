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
          v-model="settings.dealCount"
          :values="[
            { value: 1, label: 'Draw One' },
            { value: 3, label: 'Draw Three' }
          ]"
          name="drawType"
        />
      </div>

      <div class="settings__panel">
        <h3>Preferences</h3>
        <checkbox
          v-model="settings.showScore"
          name="showScore"
          label="Show game score"
        />

        <checkbox
          v-model="settings.showTimer"
          name="showTimer"
          label="Show game timer"
        />

        <checkbox
          v-model="settings.autoplayWhenClicked"
          name="autoplayWhenClicked"
          label="Autoplay cards when clicked"
        />
      </div>
    </div>

    <div
      v-else-if="activeSection === 'Appearance'"
      class="settings__content">
      <gallery v-model="settings.backfaceId" />
    </div>

    <div
      v-else
      class="settings__content">
      About...
    </div>
  </modal>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import Checkbox from '@/components/Checkbox.vue'
import Gallery from '@/components/Gallery.vue'
import Modal from '@/components/Modal.vue'
import ModalNav from '@/components/ModalNav.vue'
import RadioGroup from '@/components/RadioGroup.vue'
import { storeToRefs } from 'pinia'
import { useStore } from '@/store/main'

export default defineComponent({
  name: 'SettingsContainer',
  components: {
    Gallery,
    Checkbox,
    Modal,
    ModalNav,
    RadioGroup
  },
  setup() {
    const store = useStore()
    const { settings } = storeToRefs(store)
    const { updateSettings, toggleDialog } = store
    const sections = ['Game', 'Appearance', 'About']
    const activeSection = ref('Game')

    watch(() => store.settings, updateSettings, { deep: true })

    return {
      settings,
      sections,
      activeSection,
      toggleDialog
    }
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
