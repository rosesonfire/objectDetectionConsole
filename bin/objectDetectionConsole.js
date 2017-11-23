#!/usr/bin/env node

var { exec } = require("child_process");
var fs = require("fs");
var path = require("path");

var customFolder = process.argv[2];

if (customFolder) {
  
  if (fs.existsSync(customFolder)) {
    
    var customImages = fs.readdirSync(customFolder).filter(function(img) {
      
      return path.extname(img) === ".jpg" && fs.statSync(path.join(customFolder, img)).size / 1024 <= 100;
      

    }).map(function(img) {

      return [img, path.basename(img, ".jpg")];

    });

  } else {

    var customImages = [];

  }
  
  var customStaticFolderArg = "--content-base " + customFolder;

} else {

  var customImages = [];
  var customStaticFolderArg = "";

}

fs.writeFileSync(__dirname + "/../app/customImages.json", JSON.stringify({ customImages }));

exec("webpack-dev-server --content-base " + __dirname + "/../app " + customStaticFolderArg + " --config " + __dirname + "/webpack.config.js", function(err, stdout, stderr) {
  if (err) {
    console.log(err);
    return;
  }
  if (stderr) {
    console.log("stderr: " + stderr);
  }
});