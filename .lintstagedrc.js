module.exports = {
  '**/*.ts?(x)': (filenames) => `tsc -p tsconfig.build.json --noEmit ${filenames.join(' ')}`,
  '*.{js,jsx,ts,tsx,html,css}': (filenames) => `eslint --fix ${filenames.join(' ')} && prettier --write ${filenames.join(' ')}`,
  '*.json': ['prettier --write'],
  '*.md': ['prettier --write'],
  '*.yml': ['prettier --write'],
  '*.yaml': ['prettier --write'],
};
