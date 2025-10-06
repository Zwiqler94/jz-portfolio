module.exports = {
  root: true,
  overrides: [
    {
      files: ['**/*.ts'],
      parserOptions: {
        project: ['tsconfig.app.json', 'tsconfig.json', 'e2e/tsconfig.json'],
        createDefaultProgram: true,
      },
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@angular-eslint/recommended',
        'plugin:@angular-eslint/template/process-inline-templates',
        'prettier',
      ],
      rules: {
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-unused-vars': 'warn',
      },
    },
    {
      files: ['**/*.html'],
      extends: ['plugin:@angular-eslint/template/recommended'],
      rules: {
        '@angular-eslint/template/eqeqeq': 'error',
      },
    },
  ],
};
module.exports = {
  root: true,
  ignores: ['node_modules/**', 'dist/**', 'functions/lib/**'],
  overrides: [
    {
      files: ['**/*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        // Include the Angular app tsconfig so source files under `src/` are covered
        project: ['./tsconfig.app.json', './tsconfig.json'],
        sourceType: 'module',
      },
      plugins: ['@typescript-eslint', '@angular-eslint'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@angular-eslint/recommended'
      ],
      rules: {},
    },
    {
      files: ['**/*.html'],
      extends: ['plugin:@angular-eslint/template/recommended'],
      rules: {},
    },
    {
      files: ['**/*.js'],
      extends: ['eslint:recommended'],
    },
  ],
};
