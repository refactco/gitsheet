module.exports = {
  arrowParens: 'always',
  bracketSpacing: true,
  cursorOffset: -1,
  endOfLine: 'lf',
  htmlWhitespaceSensitivity: 'strict',
  parser: 'typescript',
  overrides: [
    {
      files: [
        '*.json',
        '.prettierrc',
        '.babelrc',
        '.editorconfig',
        '.gitignore',
        '.npmrc',
        '.env*',
      ],
      options: {
        parser: 'json',
        singleQuote: false,
        semi: false,
      },
    },
  ],
  printWidth: 100,
  proseWrap: 'always',
  quoteProps: 'consistent',
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  useTabs: false,
};
