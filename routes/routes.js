var fs = require('fs');
var mkdirp = require('mkdirp');
var IMAGEPATH = "/Users/Shared/bostonhacks/uploads/";
 
 
module.exports = function(app) {
 
 
    app.get('/',function(req,res){
        res.end("Node-File-Upload");
    });

    app.post('/upload', function(req, res) {
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
    });
 
 
    app.get('/uploads/:file', function (req, res){
            file = req.params.file;
            var img = fs.readFileSync(IMAGEPATH + file);
            res.writeHead(200, {'Content-Type': 'image/jpg' });
            res.end(img, 'binary');
     
    });
};