var fs = require('fs');
var AWS = require('aws-sdk');

// TODO: Move to environment variables
AWS.config.region = 'eu-west-1';
AWS.config.update({ accessKeyId: 'AKIAIQCKYD7IY2AYZ24Q', secretAccessKey: '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' });

var Photos = require('../models/photos.js');

function upload(folder, req, res) {
	Photos.create('', '', function(err, result) {
		if (err) {
			console.log(err);
		} else {
			id = result.ops[0]._id;
			fs.readFile(req.files.image.path, function (err, data){
				if (err) { throw err; }
				var s3 = new AWS.S3();
				var key = folder + '/' + id + '.jpg';
				s3.putObject({
					Bucket: 'djinnapp',
					Key: key,
					Body: data
				}, function(err, data) {
					if (err) {
						console.log(err);
						res.json({ 'response': "Error", 'message': err.message });
					} else {
						console.log("Successfully uploaded " + key);
						res.json({ 'response': "Saved" });
					}
				});
			});
		}
	});
};

module.exports = function(app) {

	app.get('/',function(req,res){
		res.end('Welcome to Djinn');
	});

	app.post('/upload-thumb', function(req, res) {
		upload('thumb', req, res);
	});

	app.post('/upload-full', function(req, res) {
		upload('full', req, res);
	});

	app.get('/list', function(req, res) {
		Photos.all(function(err, docs) {
			docs.toArray(function(err, els) {
				res.json({ photos: els });
			});
		});
	});

	app.get('/thumb/:file', function (req, res) {
		var s3 = new AWS.S3();
		var params = { Bucket: 'djinnapp', Key: 'thumb/' + req.params.file };
		// TODO: Error checking
		s3.getObject(params).createReadStream().pipe(res);
	});

	app.get('/full/:file', function (req, res) {
		var s3 = new AWS.S3();
		var params = { Bucket: 'djinnapp', Key: 'full/' + req.params.file };
		// TODO: Error checking
		s3.getObject(params).createReadStream().pipe(res);
	});
};
