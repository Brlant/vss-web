const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

const plugins = [
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

const targets = {
  local: 'http://localhost:8081',
  ldw: 'http://192.168.5.201:8081',
  ldw2: 'http://vss-ldm.vaiwan.com',
  sh: 'https://sh-vss.cdcerp.cn',
  un: 'https://un-vss.cdcerp.cn',
  sh_test: 'https://un-vss.cdcerp.cn/',
  xl: 'http://192.168.5.45:8081',
  cjg:'http://192.168.5.29:8081',
  yhh:'http://192.168.5.12:8081',
  yj:'http://192.168.5.23:8081',
};

const proxyTarget = targets.yj;

module.exports = {
  devServer: {
    open: true,
    port: '8018',
    https: false,
    hotOnly: false,
    disableHostCheck: true,
    proxy: {
      '/api': {
        target: proxyTarget,
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
