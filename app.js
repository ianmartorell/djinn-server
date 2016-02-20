/**
 * Module dependencies.
 */

var express  = require('express');
var connect  = require('connect');
var app      = express();
var port     = process.env.PORT || 8080;

// Configuration
app.use(express.static(__dirname + '/public'));
app.use(connect.cookieParser());
app.use(connect.logger('dev'));
app.use(connect.bodyParser());

app.use(connect.json());
app.use(connect.urlencoded());

var MongoClient = require('mongodb').MongoClient
var assert = require('assert');

var url = 'mongodb://localhost:27017/djinn';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to mongodb");

  // Classes
  require('./models.js')(app);

	// Routes
	require('./routes.js')(app);

	app.listen(port);
	console.log('The App runs on port ' + port);
  db.close();
});
