const path = require("path");
const webpack = require("webpack");

module.exports = {
  devtool: "source-map",
  entry: {
    "time-tools": "./src/index.ts",
    "time-tools.min": "./src/index.ts",
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.ts$/,
        loader: "ts-loader",
        options: {
          compilerOptions: {
            declaration: false
          },
        },
      },
    ],
  },
  output: {
    filename: "[name].js",
    library: "TimeTools",
    libraryTarget: "umd",
    path: path.resolve(__dirname, "dist", "bundles"),
    umdNamedDefine: true,
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      sourceMap: true,
    }),
  ],
  resolve: {
    extensions: [".js", ".json", ".ts"],
  },
};
