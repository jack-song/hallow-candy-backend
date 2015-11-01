var fs = require('fs');
var mkdirp = require('mkdirp');

module.exports = function(db) {
  var IMAGEPATH = "./img";
  var uploadHandler = {};

  function createImage(name, location, callback){
    db.image.create({
      name: name,
      lat: location.lat,
      lon: location.lon
    }).success(function(data){
      console.log(data);
      callback(data);
    });
  }

  uploadHandler.uploadImage = function(req, res) {
    console.log(req.files.image.originalFilename);
    console.log(req.files.image.path);

    fs.readFile(req.files.image.path, function (readErr, data){
      console.log('read file');

      if(readErr){
        console.log('readerror: ' + readErr);
      }

      var newPath = IMAGEPATH + req.files.image.originalFilename;

      console.log(newPath);

      mkdirp(IMAGEPATH, function (dirErr) {
        if(dirErr) {
          console.log(dirErr);
        }

        fs.writeFile(newPath, data, function (err) {
          if(err){
            console.log(err);
            res.json({'response':"Error"});
          } else {
            res.json({'response':"Saved"});
          }
        });
      });
    });
  }

  uploadHandler.getImage = function(req, res) {
    file = req.params.file;
    var img = fs.readFileSync(IMAGEPATH + file);
    res.writeHead(200, {'Content-Type': 'image/jpg' });
    res.end(img, 'binary');

  }

  return uploadHandler;

}