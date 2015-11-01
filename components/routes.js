module.exports = function(app, db) {
  var uploadHandler = require('./upload-handler.js')(db); 
  
  app.get('/',function(req,res){
    res.end("Node-File-Upload");
  });

  app.post('/upload', uploadHandler.uploadImage);

  app.get('/getImages', uploadHandler.getImages);
};