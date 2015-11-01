var fs = require('fs');
var mkdirp = require('mkdirp');
var hod = require('havenondemand');
var request = require('request');
var distance = require('gps-distance');
var apiKeys = require('./apikeys.js');

client = new hod.HODClient('https://api.havenondemand.com', apiKeys.haven);

module.exports = function(db) {
  var IMAGEPATH = "/img/";
  var uploadHandler = {};



  function createImage(name, location, callback){
    console.log('createImages')
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
              console.log("halloe")
              res.json({'response':"Saved"});
              getName(newPath);
            });
          }
        });
      });
    });
  }

  uploadHandler.getImage = function(req, res) {

    //assumes allImages is a nicely behaved array of images from model/
    function getImages(srcLat, srcLon, allImages) {
      var filteredImages = {
        data: []
      };

      allImages.forEach(function(image) {
        if(distance(parseFloat(srcLat), parseFloat(srcLon), parseFloat(image.lat), parseFloat(image.lon)) < 3) {
          var data = {
            name: image.name,
            path: IMAGEPATH + image.name,
            lon: image.lon,
            lat: image.lat
          };
          filteredImages.data.push(data);
        }
      });

      return filteredImages;
    }


    db.image.findAll()
    .then(function(data){
      var imageData = getImages(req.body.lat, req.body.lon, data);
      res.json(imageData, 200);
    }, function(error){
      res.json({error: "Invalid Request"}, 400);
    });
  }

  uploadHandler.imgFile =  function (req, res){
    file = req.params.file;
    var dirname = "./";
    var img = fs.readFileSync(dirname + "/img/" + file);
    res.writeHead(200, {'Content-Type': 'image/jpg' });
    res.end(img, 'binary');
  }

  return uploadHandler;

}
