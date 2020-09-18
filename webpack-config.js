const path = require('path');
require('babel-polyfill');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  resolve: {
    alias: {
      '@': resolve('src')
    }
  }
};
