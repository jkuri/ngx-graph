const path = require('path');
const root = path.resolve(__dirname);
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  context: __dirname,
  target: 'node',
  mode: 'production',
  resolve: { extensions: ['.ts', '.js'] },
  entry: {
    server: path.join(root, 'server.ts')
  },
  output: {
    path: path.join(root, '../..', 'dist/app'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [{ loader: 'ts-loader?silent=true&configFile=tsconfig.json' }]
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()]
  },
  stats: {
    assets: false,
    chunks: false,
    chunkModules: false,
    colors: true,
    timings: true,
    children: false,
    cachedAssets: false,
    chunkOrigins: false,
    modules: false,
    warnings: false
  },
  node: {
    global: false,
    __filename: false,
    __dirname: false
  }
};
