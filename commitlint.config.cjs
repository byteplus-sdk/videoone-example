// Copyright (c) 2025 BytePlus Pte. Ltd.
// SPDX-License-Identifier: Apache-2.0
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Bug fix
        'docs', // Documentation changes
        'style', // Code formatting (changes that do not affect code execution)
        'refactor', // Refactoring (neither adds feature nor fixes bug)
        'perf', // Performance optimization
        'test', // Adding tests
        'chore', // Build process or auxiliary tool changes
        'revert', // Revert changes
        'build', // Build related changes
        'ci', // CI configuration changes
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'scope-case': [0],
    'subject-case': [0],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [0],
    'body-leading-blank': [1, 'always'],
    'footer-leading-blank': [1, 'always'],
    'header-max-length': [2, 'always', 72],
  },
};
