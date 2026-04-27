import { describe, it, expect, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import { useStore } from '@/store/main'
import Gallery from '@/components/Gallery.vue'
import RadioGroup from '@/components/RadioGroup.vue'
import Checkbox from '@/components/Checkbox.vue'
import ModalNav from '@/components/ModalNav.vue'
import SettingsContainer from '../SettingsContainer.vue'

describe('SettingsContainer', () => {
  let pinia: ReturnType<typeof createPinia>
  let store: ReturnType<typeof useStore>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    store = useStore()
    localStorage.clear()
  })

  function mountSettings() {
    return shallowMount(SettingsContainer, {
      global: {
        plugins: [pinia],
        // Stub Modal to render its default slot so inner components are accessible
        stubs: { Modal: { template: '<div><slot /></div>' } }
      }
    })
  }

  describe('default section — Game', () => {
    it('renders the RadioGroup for the draw type', () => {
      const wrapper = mountSettings()
      expect(wrapper.findComponent(RadioGroup).exists()).toBe(true)
    })

    it('renders checkboxes for each preference toggle', () => {
      const wrapper = mountSettings()
      expect(wrapper.findAllComponents(Checkbox).length).toBeGreaterThan(0)
    })

    it('does not render the Gallery in the Game section', () => {
      const wrapper = mountSettings()
      expect(wrapper.findComponent(Gallery).exists()).toBe(false)
    })
  })

  describe('Appearance section', () => {
    it('renders the Gallery when the Appearance section is active', async () => {
      const wrapper = mountSettings()
      // Trigger section change by emitting from ModalNav instead of accessing vm
      wrapper.findComponent(ModalNav).vm.$emit('update:modelValue', 'Appearance')
      await nextTick()
      expect(wrapper.findComponent(Gallery).exists()).toBe(true)
    })

    it('hides the RadioGroup when the Appearance section is active', async () => {
      const wrapper = mountSettings()
      wrapper.findComponent(ModalNav).vm.$emit('update:modelValue', 'Appearance')
      await nextTick()
      expect(wrapper.findComponent(RadioGroup).exists()).toBe(false)
    })
  })

  describe('About section', () => {
    it('shows "About..." text when the About section is active', async () => {
      const wrapper = mountSettings()
      wrapper.findComponent(ModalNav).vm.$emit('update:modelValue', 'About')
      await nextTick()
      expect(wrapper.text()).toContain('About')
    })
  })

  describe('close event', () => {
    it('calls store.toggleDialog(false) when ModalNav emits close', async () => {
      const toggleDialogSpy = vi.spyOn(store, 'toggleDialog')
      const wrapper = mountSettings()
      // Use vm.$emit to trigger the Vue component event (not a native DOM event)
      wrapper.findComponent(ModalNav).vm.$emit('close')
      await nextTick()
      expect(toggleDialogSpy).toHaveBeenCalledWith(false)
    })
  })

  describe('settings watcher', () => {
    it('calls store.updateSettings when settings change', async () => {
      const updateSettingsSpy = vi.spyOn(store, 'updateSettings')
      mountSettings()
      store.settings.dealCount = 3
      await nextTick()
      await nextTick()
      expect(updateSettingsSpy).toHaveBeenCalled()
    })
  })
})
