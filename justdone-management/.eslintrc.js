module.exports = {
  root: true,
  parser: 'babel-eslint',
  env: {
      browser: true,
      commonjs: true,
      es6: true,
      jquery: true,
      node: true
  },
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
      'html'
  ],
  rules: {
      'indent': ['warn', 4],
      'semi': ['warn', 'always'],
      'require-jsdoc': 'off',
      'valid-jsdoc': 'off',
      'max-len': 'off',
      'no-debugger': 'off',
      'no-console': 'warn',
      'curly': 'off',
      'arrow-parens': 'off',
      'comma-dangle': 'off',
      'linebreak-style': 'off',
      'yoda': 'warn',
      'space-infix-ops': 'warn',
      'switch-colon-spacing': ['warn', {'before': false, 'after': true}],
      'key-spacing': ['warn', {'beforeColon': false, 'afterColon': true}],
      'eqeqeq': ['warn', 'always', {'null': 'ignore'}],
      'no-multiple-empty-lines': ['warn', { 'max': 1, 'maxEOF': 1 }],
      'keyword-spacing': ['warn', {'before': true, 'after': true}],
      'arrow-spacing': ['warn', {'before': true, 'after': true}],
      'brace-style': ['warn', 'stroustrup'],
      'object-curly-spacing': ['warn', 'never', {'objectsInObjects': false, 'arraysInObjects': false}],
      'space-before-function-paren': ['warn', {
          'anonymous': 'never',
          'named': 'never',
          'asyncArrow': 'always'
      }]
  },
  parserOptions: {
      ecmaVersion: 7,
      sourceType: 'module',
      ecmaFeatures: {}
  },
  globals: {}
}
