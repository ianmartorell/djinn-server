var fs = require('fs');
var gm = require('gm');
var AWS = require('aws-sdk');

// TODO: Move to environment variables
AWS.config.region = 'eu-west-1';
AWS.config.update({ accessKeyId: 'AKIAIQCKYD7IY2AYZ24Q', secretAccessKey: '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' });

var Photos = require('../models/photos.js');

module.exports = function(app) {

	app.get('/',function(req,res){
		res.end('Welcome to Djinn');
	});

	app.post('/upload', function(req, res) {
		Photos.create(req.title, req.description, function(err, result) {
			if (err) {
				console.log(err);
			} else {
				id = result.ops[0]._id;
				fs.readFile(req.files.image.path, function (err, fullData){
					if (err) throw err;
					var s3 = new AWS.S3({ params: { Bucket: 'djinnapp' } });
					// Upload full image
					var fullKey = 'full/' + id + '.jpg';
					s3.putObject({
						Key: fullKey,
						Body: fullData
					}, function(err, data) {
						if (err) {
							console.log(err);
							res.json({ 'response': "Error", 'message': err.message });
						} else {
							console.log("Successfully uploaded " + fullKey);
							res.json({ 'response': "Saved" });
						}
					});
					// Create thumbnail and upload it
					thumbKey = 'thumb/' + id + '.jpg';
					var size = {width: 200, height: 200};
					thumbStrm = gm(req.files.image.path)
					.resize(size.width, size.height, "^>")
					.gravity('Center')
					.extent(size.width, size.height)
					.stream()
					s3.upload({
						Key: thumbKey,
						Body: thumbStrm
					}, function(err, data) {
						if (err) {
							console.log(err);
							res.json({ 'response': "Error", 'message': err.message });
						} else {
							console.log("Successfully uploaded " + thumbKey);
							res.json({ 'response': "Saved" });
						}
					});
				});
			}
		});
	});

	app.get('/list', function(req, res) {
		Photos.all(function(err, docs) {
			docs.toArray(function(err, els) {
				res.json({ photos: els });
			});
		});
	});

	app.get('/full/:file', function (req, res) {
		var s3 = new AWS.S3();
		var params = { Bucket: 'djinnapp', Key: 'full/' + req.params.file };
		// TODO: Error checking
		s3.getObject(params).createReadStream().pipe(res);
	});

	app.get('/thumb/:file', function (req, res) {
		var s3 = new AWS.S3();
		var params = { Bucket: 'djinnapp', Key: 'thumb/' + req.params.file };
		// TODO: Error checking
		s3.getObject(params).createReadStream().pipe(res);
	});
};
