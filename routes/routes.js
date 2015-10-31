var fs = require('fs');
var IMAGEPATH = "/home/bostonhacks/";
 
 
module.exports = function(app) {
 
 
    app.get('/',function(req,res){
        res.end("Node-File-Upload");
     
    });

    app.post('/upload', function(req, res) {
        console.log(req.files.image.originalFilename);
        console.log(req.files.image.path);
            fs.readFile(req.files.image.path, function (err, data){
                var newPath = IMAGEPATH + "/uploads/" +   req.files.image.originalFilename;
                fs.writeFile(newPath, data, function (err) {
                    if(err){
                        res.json({'response':"Error"});
                    } else {
                        res.json({'response':"Saved"});
                    }
                });
        });
    });
 
 
    app.get('/uploads/:file', function (req, res){
            file = req.params.file;
            var img = fs.readFileSync(IMAGEPATH + "/uploads/" + file);
            res.writeHead(200, {'Content-Type': 'image/jpg' });
            res.end(img, 'binary');
     
    });
};