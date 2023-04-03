// const webpack = require('webpack');
const CompressionWebpackPlugin = require('compression-webpack-plugin');    //引入插件
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;


module.exports = {
    productionSourceMap: false,
    lintOnSave: process.env.NODE_ENV !== 'production',
    chainWebpack: config => {
        // 移除 prefetch 插件减少带宽消耗
        config.plugins.delete('prefetch');
        //生产环境开启gzip压缩
        if (process.env.NODE_ENV === 'production') {
            config.plugin('compressionPlugin')
                .use(new CompressionWebpackPlugin({
                    algorithm: 'gzip',
                    test: productionGzipExtensions,
                    compressionOptions: { level: 9 },
                    threshold: 10240,
                    minRatio: 0.8,
                    deleteOriginalAssets: false
                }));
       }
    }
};
