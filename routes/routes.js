var fs = require('fs');
var s3 = require('s3');

var client = s3.createClient({
	maxAsyncS3: 20,     // this is the default
	s3RetryCount: 3,    // this is the default
	s3RetryDelay: 1000, // this is the default
	multipartUploadThreshold: 20971520, // this is the default (20 MB)
	multipartUploadSize: 15728640, // this is the default (15 MB)
	s3Options: {
		accessKeyId: "AKIAIQCKYD7IY2AYZ24Q",
		secretAccessKey: "fBG4TqOpYQKutP1zU0CczHpHRrGU6A2T4YksbTM3",
		region: "Ireland",
		// endpoint: 's3.yourdomain.com',
		// sslEnabled: false
		// any other options are passed to new AWS.S3()
		// See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
	},
});

module.exports = function(app) {

	app.get('/',function(req,res){
		res.end('Welcome to Djinn');
	});

	app.post('/upload', function(req, res) {
		console.log(req.files.image.originalFilename);
		console.log(req.files.image.path);
		fs.readFile(req.files.image.path, function (err, data){
			var dirname = "/Users/ian/djinn";
			var newPath = dirname + "/uploads/" + req.files.image.originalFilename;
			fs.writeFile(newPath, data, function (err) {
				if(err){
					res.json({'response':"Error"});
				} else {
					res.json({'response':"Saved"});
					var params = {
						localFile: newPath,
						s3Params: {
							Bucket: "djinapp",
							Key: req.files.image.originalFilename,
							// other options supported by putObject, except Body and ContentLength.
							// See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
						}
					};
					var uploader = client.uploadFile(params);
					uploader.on('error', function(err) {
						console.error("unable to upload:", err.stack);
					});
					uploader.on('progress', function() {
						console.log("progress", uploader.progressMd5Amount,
											uploader.progressAmount, uploader.progressTotal);
					});
					uploader.on('end', function() {
						console.log("done uploading");
					});
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
