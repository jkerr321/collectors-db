module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "rules": {
        'eqeqeq': 'error',
        'guard-for-in': 'error',
        'indent': ['error', 'tab', { 'SwitchCase': 1 }],
        'new-cap': 'off',
        'no-caller': 'error',
        // 'no-console': 'error',
        'no-extend-native': 'error',
        'no-irregular-whitespace': 'error',
        'no-loop-func': 'error',
        'no-multi-spaces': 'error',
        'no-trailing-spaces': 'error',
        'no-undef': 'error',
        'no-underscore-dangle': 'off',
        'no-unused-vars': 'error',
        'no-var': 'error',
        'one-var': ['error', 'never'],
        'quotes': ['error', 'single'],
        'semi': ['warn', 'always'],
        'space-before-function-paren': ['error', 'always'],
        'wrap-iife': 'error'
    }
};