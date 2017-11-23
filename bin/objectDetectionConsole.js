#!/usr/bin/env node

var { exec } = require("child_process");
var fs = require("fs");
var path = require("path");

var customFolder = process.argv[2];

if (customFolder) {
  
  if (fs.existsSync(customFolder)) {
    
    var customImages = fs.readdirSync(customFolder).filter(function(img) {
      
      return path.extname(img) === ".jpg";

    }).map(function(img) {

      return [img, path.basename(img, ".jpg")];

    });

  } else {

    var customImages = [];

  }
  
  var custom = true;
  var customStaticFolderArg = "--content-base " + customFolder;

} else {

  var customImages = [];
  var custom = false;
  var customStaticFolderArg = "";

}

fs.writeFileSync(__dirname + "/../app/customImages.json", JSON.stringify({ customImages, custom }));

exec("webpack-dev-server --content-base " + __dirname + "/../app " + customStaticFolderArg + " --config " + __dirname + "/webpack.config.js", function(err, stdout, stderr) {
  if (err) {
    console.log(err);
    return;
  }
  if (stderr) {
    console.log(`stderr: ${stderr}`);
  }
});