import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import vueTsEslintConfig from '@vue/eslint-config-typescript'

export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  ...vueTsEslintConfig(),
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      'no-debugger': 'warn',
      'no-unreachable': 'warn'
    }
  },
  {
    ignores: ['dist/**', 'coverage/**', 'node_modules/**']
  }
]
