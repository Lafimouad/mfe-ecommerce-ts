
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;
const deps = require('./package.json').dependencies || {};

module.exports = {
  entry: './src/index.tsx',
  mode: 'development',
  devServer: {
    port: 3002,
    historyApiFallback: true
  },
  output: {
    publicPath: 'auto'
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'mfe-cart',
      filename: 'remoteEntry.js',
      exposes: {"./CartApp": "./src/bootstrap"},
      remotes: {
        products: 'products@http://localhost:3001/remoteEntry.js',
        cart: 'cart@http://localhost:3002/remoteEntry.js',
        checkout: 'checkout@http://localhost:3003/remoteEntry.js',
        ui: 'ui@http://localhost:3004/remoteEntry.js'
      },
      shared: {
        ...deps,
        react: { singleton: true, eager: true, requiredVersion: deps.react },
        'react-dom': { singleton: true, eager: true, requiredVersion: deps['react-dom'] }
      }
    }),
    new HtmlWebpackPlugin({ template: './public/index.html' })
  ]
}
