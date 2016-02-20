var fs = require('fs');
var AWS = require('aws-sdk');

AWS.config.region = 'eu-west-1';
AWS.config.update({ accessKeyId: 'AKIAIQCKYD7IY2AYZ24Q', secretAccessKey: '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' });

module.exports = function(app) {
	app.get('/',function(req,res){
		res.end('Welcome to Djinn');
	});

	app.post('/upload', function(req, res) {
		console.log(req.files.image.originalFilename);
		console.log(req.files.image.path);
		fs.readFile(req.files.image.path, function (err, data){
			if (err) { throw err; }
			var s3 = new AWS.S3();
			s3.putObject({
				Bucket: 'djinnapp',
				Key: req.files.image.originalFilename,
				Body: data
			}, function(err, data) {
				if (err) {
					console.log(err)
					res.json({'response':"Error"});
				} else {
					console.log("Successfully uploaded data to myBucket/myKey");
					res.json({'response':"Saved"});
				}
			});
		});
	});

	app.get('/uploads/:file', function (req, res){
		file = req.params.file;
		var dirname = "/Users/ian/djinn";
		var img = fs.readFileSync(dirname + "/uploads/" + file);
		res.writeHead(200, {'Content-Type': 'image/jpg' });
		res.end(img, 'binary');
	});
};
