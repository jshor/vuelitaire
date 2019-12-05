import { CardBacks } from '@/constants'
import IRootState from '@/interfaces/IRootState'
import ISettingsState from '@/interfaces/ISettingsState'
import { ActionContext, ActionTree, GetterTree, Module, MutationTree } from 'vuex'

const createState = (): ISettingsState => ({
  dealCount: 1,
  backfaceId: 'A1',
  showScore: true,
  showTimer: true,
  autoplayWhenClicked: false,
  showDialog: false
})

const state: ISettingsState = createState()

const getters: GetterTree<ISettingsState, IRootState> = {
  backface (state: ISettingsState) {
    return CardBacks[state.backfaceId]
  }
}

const actions: ActionTree<ISettingsState, IRootState> = {
  /**
   * Applies settings from localStorage. Falls back to default settings if not applicable.
   *
   * @param {ActionContext<ISettingsState, IRootState>} context
   */
  loadLocalStorageSettings ({ commit }: ActionContext<ISettingsState, IRootState>): void {
    const settings: ISettingsState = createState()

    try {
      const data = localStorage.getItem('settings')

      Object.assign(settings, JSON.parse(data))
    } catch (error) {
      // do nothing, we ignore the error
    }

    commit('UPDATE_SETTINGS', settings)
    commit('deck/SET_DEAL_COUNT', settings.dealCount, { root: true })
  },

  /**
   * Updates settings in localStorage and on the state.
   *
   * @param {ActionContext<ISettingsState, IRootState>} context
   */
  updateSettings ({ commit }: ActionContext<ISettingsState, IRootState>, settings: ISettingsState): void {
    localStorage.setItem('settings', JSON.stringify(settings))

    commit('UPDATE_SETTINGS', settings)
  },

  toggleDialog ({ dispatch, state }: ActionContext<ISettingsState, IRootState>, showDialog: boolean): void {
    dispatch('updateSettings', {
      ...state,
      showDialog
    })
  }
}

const mutations: MutationTree<ISettingsState> = {
  /**
   * Updates all settings with the new ones provided.
   *
   * @param {ISettingsState} state
   * @param {ISettingsState} newSettings
   */
  UPDATE_SETTINGS (state: ISettingsState, newSettings: ISettingsState) {
    Object.assign(state, newSettings)
  }
}

const settings: Module<ISettingsState, IRootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

export default settings
