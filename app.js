/**
 * Module dependencies.
 */

var express  = require('express');
var connect  = require('connect');
var app      = express();
var port     = process.env.PORT || 8080;

var db = require('./db');

// Configuration
app.use(express.static(__dirname + '/public'));
app.use(connect.cookieParser());
app.use(connect.logger('dev'));
app.use(connect.bodyParser());

app.use(connect.json());
app.use(connect.urlencoded());


// Routes
require('./controllers/photos.js')(app);

// Connect to Mongo on start
db.connect('mongodb://localhost:27017/djinn', function(err) {
  if (err) {
    console.log('Unable to connect to Mongo.');
    process.exit(1);
  } else {
    app.listen(port, function() {
      console.log('Listening on port ' + port);
    });
  }
});
