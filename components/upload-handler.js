var fs = require('fs');
var mkdirp = require('mkdirp');
var hod = require('havenondemand');
var apiKeys = require('./apikeys.js');

client = new hod.HODClient('https://api.havenondemand.com', apiKeys.haven);

module.exports = function(db) {
  var IMAGEPATH = "./img/";
  var uploadHandler = {};

  function createImage(name, location, callback){
    db.image.create({
      name: name,
      lat: location.lat,
      lon: location.lon
    }).then(function(data){
      callback();
    }, function(error){
      console.log(error);
     res.json({'response':"Error"});
    });
  }

  function getName(path) {
    console.log('getting name');
    var data = {'file' : path};
    client.call('recognizebarcodes', data, function(err,resp,body){
      console.log('built in request ' + JSON.stringify(body));
      console.log('code is ' + body.barcode[0].text);


    });

  }

  uploadHandler.uploadImage = function(req, res) {
    console.log (req.body);
    var fileName = req.files.image.originalFilename;

    fs.readFile(req.files.image.path, function (readErr, data){
      console.log('read file');

      if(readErr){
        console.log('readerror: ' + readErr);
      }

      var newPath = IMAGEPATH + fileName;

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
            var location = {
              lon : req.body.lon,
              lat : req.body.lat
            };
            createImage(fileName,location, function(){
              res.json({'response':"Saved"});
              getName(newPath);
            });
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
