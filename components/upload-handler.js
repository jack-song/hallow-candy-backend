var fs = require('fs');
var mkdirp = require('mkdirp');
var hod = require('havenondemand');
var request = require('request');
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
    }).success(function(data){
      console.log(data);
      callback(data);
    });
  }

  function getName(path) {
    console.log('getting name');
    var data = {'file' : path};
    client.call('recognizebarcodes', data, function(err,resp,body){

      //if code retrieved
      if(body && body.barcode && body.barcode[0] && body.barcode[0].text) {
        var code = body.barcode[0].text;
        console.log('code is ' + code);

        request('http://api.upcdatabase.org/json/' + apiKeys.upc + '/' + code, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            body = JSON.parse(body);

            var item = body.itemname || body.description;
            console.log('item is ' + item);
          }
        });
      } else {
        console.log('bad picture');
      }
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
            getName(newPath);
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