const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const SentryWebpackPlugin = require('@sentry/webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

const plugins = [new SentryWebpackPlugin({
  include: './dist/static/map',
  ignoreFile: '.sentrycliignore',
  ignore: ['node_modules'],
  configFile: 'sentry.properties'
}),
  new CopyWebpackPlugin([
    {
      from: path.resolve(__dirname, 'static'),
      to: 'static',
      ignore: ['.*']
    }
  ])];
if (process.env.NODE_ENV === 'production') {
  plugins.push(new CompressionWebpackPlugin({
    asset: '[path].gz[query]',
    algorithm: 'gzip',
    test: new RegExp(
      '\\.(' +
      ['js', 'css'].join('|') +
      ')$'
    ),
    threshold: 10240,
    minRatio: 0.8
  }));
}

module.exports = {
  devServer: {
    open: true,
    port: '8018',
    https: false,
    hotOnly: false,
    disableHostCheck: true,
    proxy: {
      '/api': {
        target: 'https://dev-vss.cdcerp.cn/',
        changOrigin: true
      }
    }
  },
  transpileDependencies: ['@dtop'],
  configureWebpack: {
    plugins: plugins
  },
  chainWebpack: config => {
    // 移除 prefetch 插件
    config.plugins.delete('prefetch');
  }
};
