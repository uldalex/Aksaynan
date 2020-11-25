/* global module */

let config = {
  'notGetBlocks': [
    'blocks-demo.html',
  ],
  'ignoredBlocks': [
    'no-js',
  ],
  'alwaysAddBlocks': [
    // 'sprite-svg',
    // 'sprite-png',
    // 'object-fit-polyfill',
  ],
  'addStyleBefore': [
    'src/scss/variables.scss',
    'src/scss/mixins.scss',
    // 'somePackage/dist/somePackage.css', // для 'node_modules/somePackage/dist/somePackage.css',
  ],
  'addStyleAfter': [
    // 'src/scss/print.scss',
  ],
  'addJsBefore': [
    // 'somePackage/dist/somePackage.js', // для 'node_modules/somePackage/dist/somePackage.js',
  ],
  'addJsAfter': [
    './script.js',
  ],
  'addAssets': {
    'src/fonts/open-sans-v18-latin_cyrillic-regular.woff2': 'fonts/',
    'src/fonts/open-sans-v18-latin_cyrillic-italic.woff2': 'fonts/',
    'src/fonts/open-sans-v18-latin_cyrillic-600.woff2': 'fonts/',
    'src/fonts/open-sans-v18-latin_cyrillic-600italic.woff2': 'fonts/',
    'src/fonts/open-sans-v18-latin_cyrillic-800.woff2': 'fonts/',
    'src/fonts/open-sans-v18-latin_cyrillic-800italic.woff2': 'fonts/',
    'src/fonts/HelloDinaScript.woff2': 'fonts/',
    'src/favicon/*.{png,ico,svg,xml,webmanifest}': 'img/favicon',
     "./src/img/*.{png,svg,jpg,jpeg}": "img/",
    'node_modules/somePackage/images/*.{png,svg,jpg,jpeg}': 'img/',
  },
  'dir': {
    'src': 'src/',
    'build': 'build/',
    'blocks': 'src/blocks/'
  }
};

module.exports = config;
