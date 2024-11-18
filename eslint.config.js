// eslint.config.js
import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default [
  {
    ignores: ['dist'], // ESLint가 무시할 디렉토리
  },
  {
    files: ['**/*.{ts,tsx}'], // TypeScript 파일을 대상으로 설정
    languageOptions: {
      parser: typescriptParser,
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.browser,
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      '@typescript-eslint': typescriptEslint,
    },
    rules: {
      ...react.configs.recommended.rules, // React 기본 규칙
      ...reactHooks.configs.recommended.rules, // React Hooks 관련 규칙
      ...typescriptEslint.configs.recommended.rules, // TypeScript 기본 규칙
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
];
