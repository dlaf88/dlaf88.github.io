const path = require("path");

module.exports = {
  entry: { main: path.join(__dirname, "_webpack", "main") },
  output: {
    path: path.resolve(__dirname, "assets"),
    filename: "[name]-bundle.js",
  },
  resolve: { extensions: [".json", ".js"], modules: ["node_modules"] },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
      {
        test: /\.scss$/,
        use: [
          {
            loader: "css-loader",
            options: {
              importLoaders: 1, // https://webpack.js.org/loaders/postcss-loader/
            },
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: () => [
                require("cssnano")(), // https://cssnano.co/
              ],
            },
          },
          {
            loader: "sass-loader",
            options: {},
          },
        ],
      },
    ],
  },
};
