import studio from '@sanity/eslint-config-studio';
import prettier from 'eslint-plugin-prettier';
import importPlugin from 'eslint-plugin-import';
import checkFile from 'eslint-plugin-check-file';

export default [
  ...studio,

  // Prettier configuration
  {
    plugins: {
      prettier: prettier,
    },
    rules: {
      // Prettier rules
      'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    },
  },

  // File configuration
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      import: importPlugin,
      'check-file': checkFile,
    },
    rules: {
      // Import rules
      'import/no-cycle': 'error',
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/default': 'off',
      'import/no-named-as-default-member': 'off',
      'import/no-named-as-default': 'off',

      // File naming rules
      'check-file/filename-naming-convention': [
        'error',
        {
          '**/*.{ts,tsx}': 'KEBAB_CASE',
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],

      // Other rules
      'linebreak-style': ['error', 'unix'],
    },
  },

  // Folder naming convention
  {
    files: ['**/!(__tests__)/*'],
    plugins: {
      'check-file': checkFile,
    },
    rules: {
      'check-file/folder-naming-convention': [
        'error',
        {
          '**/*': 'KEBAB_CASE',
        },
      ],
    },
  },
];
