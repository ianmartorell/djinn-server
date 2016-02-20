var db = require('../db')

exports.create = function(title, text, cb) {
	var collection = db.get().collection('photos');
  var photo = {
    title: title,
    text: text,
    date: new Date().toString()
  }

  collection.save(photo, cb);
}

exports.get = function(id, cb) {
	var collection = db.get().collection('photos');
  collection.findOne({_id: id}, cb);
}

exports.all = function(cb) {
	var collection = db.get().collection('photos');
  collection.find({}, cb);
}
