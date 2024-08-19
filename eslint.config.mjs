import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';

export default [
  {
    ignores: ['public/*', '.cache/*'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      globals: globals.browser,
      sourceType: 'module',
    },
  },
  {
    files: ['**/*.cjs', '**/*.js'],
    languageOptions: {
      sourceType: 'script',
    },
    rules: {
      'no-undefined': 'off',
    },
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ...pluginReact.configs.flat.recommended,
    rules: {
      'react/prop-types': 'off',
    },
  },
];
