#!/usr/bin/env node

var WebpackDevServer = require("webpack-dev-server");
var webpack = require("webpack");
var config = require("./../webpack.config.js");

var compiler = webpack(config);
var server = new WebpackDevServer(compiler);
var host = "localhost";
var port = 8080

server.listen(port, host, function() {
  
  console.log(`Started server at ${host}:${port}`);

});