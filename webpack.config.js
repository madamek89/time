const path = require("path");
const TypedocWebpackPlugin = require("typedoc-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  devtool: "source-map",
  entry: {
    "time": "./src/index.ts",
    "time.min": "./src/index.ts",
  },
  module: {
    rules: [{
      exclude: /node_modules/,
      test: /\.ts$/,
      loader: "ts-loader",
      options: {
        compilerOptions: {
          declaration: false
        },
      },
    }, ],
  },
  output: {
    filename: "[name].js",
    library: "Time",
    libraryTarget: "umd",
    path: path.resolve(__dirname, "dist", "bundles"),
    umdNamedDefine: true,
  },
  plugins: [
    new TypedocWebpackPlugin({
      // excludeNotExported: true,
      excludePrivate: true,
      mode: "file",
      out: path.resolve(__dirname, "docs"),
      theme: 'minimal',
    }, ["./src"]),
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      sourceMap: true,
    }),
  ],
  resolve: {
    extensions: [".js", ".json", ".ts"],
  },
};
