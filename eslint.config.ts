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
      'no-unreachable': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', {
        'args': 'none',
        'caughtErrorsIgnorePattern': '^_',
        'destructuredArrayIgnorePattern': '^_',
      }]
    }
  },
  {
    ignores: ['dist/**', 'coverage/**', 'node_modules/**']
  }
]
