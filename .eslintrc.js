module.exports = {
  env: {
    browser: true,
    es2024: true
  },
  extends: ['eslint:recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    // byte saving rules
    'no-duplicate-imports': 2,
    'object-shorthand': 2,
    'prefer-arrow-callback': 2,
    'no-else-return': 2,
    'one-var': [
      'error',
      {
        uninitialized: 'always'
      }
    ],
    'prefer-exponentiation-operator': 2,
    'no-restricted-syntax': [
      'error',
      {
        selector: 'BinaryExpression[operator="==="]',
        message: "Prefer '==' over '===' to save bytes"
      },
      {
        selector: 'BinaryExpression[operator="!=="]',
        message: "Prefer '!=' over '!==' to save bytes"
      },
      {
        selector:
          'MemberExpression[object.name=Math][property.name=floor]',
        message: "Prefer '| 0' over 'Math.floor' to save bytes"
      },
      {
        selector: 'MemberExpression[property.name=forEach]',
        message: "Prefer '.map()' over '.forEach()' to save bytes"
      }
    ],

    // code style rules
    'spaced-comment': [
      'error',
      'always',
      {
        exceptions: ['@__PURE__']
      }
    ],
    'array-bracket-spacing': 2,
    'object-curly-spacing': ['error', 'always'],
    'no-trailing-spaces': 2,
    'multiline-comment-style': ['error', 'separate-lines'],
    'max-len': [
      'error',
      {
        comments: 80,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreRegExpLiterals: true
      }
    ]
  },
  overrides: [
    {
      files: ['test/**/*.js'],
      env: {
        browser: true,
        es2024: true,
        mocha: true
      },
      globals: {
        assert: true,
        sinon: true
      },
      plugins: ['mocha-no-only'],
      rules: {
        'no-restricted-syntax': 0,
        'mocha-no-only/mocha-no-only': 2
      }
    }
  ]
};
