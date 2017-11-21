#!/usr/bin/env node

var { exec } = require("child_process");

exec(`webpack-dev-server --content-base ${__dirname}/../app --config ${__dirname}/webpack.config.js`, function(err, stdout, stderr) {
  if (err) {
    console.log(err);
    return;
  }
  console.log(`stderr: ${stderr}`);
});