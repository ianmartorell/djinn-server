var fs = require('fs');

module.exports = function(app) {

	app.get('/',function(req,res){
		res.end("Djinn");
	});

	app.post('/upload', function(req, res) {
		console.log(req.files.image.originalFilename);
		console.log(req.files.image.path);
		fs.readFile(req.files.image.path, function (err, data){
			var dirname = "~/djinn";
			var newPath = dirname + "/uploads/" + 	req.files.image.originalFilename;
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
		var dirname = "~/djinn";
		var img = fs.readFileSync(dirname + "/uploads/" + file);
		res.writeHead(200, {'Content-Type': 'image/jpg' });
		res.end(img, 'binary');
	});
};
