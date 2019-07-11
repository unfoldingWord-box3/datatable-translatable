const Path = require('path');
const upperFirst = require('lodash/upperFirst');
const camelCase = require('lodash/camelCase');
const { name, version, description } = require('./package.json');
const { styles, theme } = require('./styleguide.styles');

module.exports = {
  title: `${upperFirst(camelCase(name))} v${version}`,
  ribbon: {
    url: 'https://github.com/unfoldingWord-box3/datatable-translatable',
    text: 'View me on GitHub'
  },
  webpackConfig: require('react-scripts/config/webpack.config')('development'),
  // serverPort: 3000,
  styles,
  theme,
  getComponentPathLine: (componentPath) => {
    const file = Path.parse(componentPath).base;
    const componentName = file.replace(/\.js$/, '');
    return `import { ${componentName} } from "${name}";`;
  },
  usageMode: 'expand',
  exampleMode: 'expand',
  pagePerSection: true,
  sections: [
    {
      name: upperFirst(camelCase(name)),
      description,
      content: './readme.md',
      components: () => ([
        Path.resolve(__dirname, `src/components/datatable`, `DataTable.js`),
        Path.resolve(__dirname, `src/components/cell`, `Cell.js`),
        Path.resolve(__dirname, `src/components/toolbar`, `Toolbar.js`),
      ]),
    },
  ]
};
