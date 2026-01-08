const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin =
  require("webpack").container.ModuleFederationPlugin;
const deps = require("./package.json").dependencies || {};

const isProduction = process.env.NODE_ENV === "production";

// Get remote URLs from environment variables or use localhost
const getRemoteUrl = (name, port) => {
  const envVar = `REACT_APP_MFE_${name.toUpperCase()}_URL`;
  return process.env[envVar] || `http://localhost:${port}`;
};

module.exports = {
  entry: "./src/index.tsx",
  mode: isProduction ? "production" : "development",
  devServer: {
    port: 3000,
    historyApiFallback: true,
  },
  output: {
    publicPath: "auto",
    clean: true,
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "host",
      filename: "remoteEntry.js",
      exposes: {},
      remotes: {
        products: `products@${getRemoteUrl("products", 3001)}/remoteEntry.js`,
        cart: `cart@${getRemoteUrl("cart", 3002)}/remoteEntry.js`,
        checkout: `checkout@${getRemoteUrl("checkout", 3003)}/remoteEntry.js`,
        auth: `auth@${getRemoteUrl("auth", 3004)}/remoteEntry.js`,
        search: `search@${getRemoteUrl("search", 3005)}/remoteEntry.js`,
        wishlist: `wishlist@${getRemoteUrl("wishlist", 3006)}/remoteEntry.js`,
        orders: `orders@${getRemoteUrl("orders", 3007)}/remoteEntry.js`,
        ui: `ui@${getRemoteUrl("ui", 3008)}/remoteEntry.js`,
      },
      shared: {
        ...deps,
        react: { singleton: true, eager: true, requiredVersion: deps.react },
        "react-dom": {
          singleton: true,
          eager: true,
          requiredVersion: deps["react-dom"],
        },
      },
    }),
    new HtmlWebpackPlugin({ template: "./public/index.html" }),
  ],
};
