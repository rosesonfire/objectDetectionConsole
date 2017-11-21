var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var HtmlWebpackExcludeAssetsPlugin = require("html-webpack-exclude-assets-plugin");

const template = "./../app/template.html";
const scripts = "./../app/script.js";
const styles = "./../app/style.css";
const outputPath = __dirname + "/public";

module.exports = {
  context: __dirname,
  entry: {
    scripts: scripts,
    styles: styles
  },
  output: {
    path: outputPath,
    filename: "[name].min.js"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract([
          {
            loader: "css-loader",
            options: {
              minimize: true
            }
          }
        ])
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("[name].min.css"),
    new HtmlWebpackPlugin({
      hash: true,
      template: template,
      excludeAssets: [/styles.*js/]
    }),
    new HtmlWebpackExcludeAssetsPlugin()
  ],
  devServer: {
    inline: true,
    open: true
  }
};