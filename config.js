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
    'src/fonts/open-sans-v18-latin_cyrillic-regular': 'fonts/',
    'src/fonts/open-sans-v18-latin_cyrillic-italic': 'fonts/',
    'src/fonts/open-sans-v18-latin_cyrillic-600': 'fonts/',
    'src/fonts/open-sans-v18-latin_cyrillic-600italic': 'fonts/',
    'src/fonts/open-sans-v18-latin_cyrillic-800': 'fonts/',
    'src/fonts/open-sans-v18-latin_cyrillic-800italic': 'fonts/',
    'src/fonts/HelloDinaScript': 'fonts/',
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
