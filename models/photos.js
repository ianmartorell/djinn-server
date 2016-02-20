var db = require('../db');

exports.create = function(eventId, title, description, cb) {
	var collection = db.get().collection('photos');
	var photo = {
		eventId: eventId,
		title: title,
		description: description,
		date: new Date().toString()
	};
	collection.save(photo, cb);
};

exports.get = function(id, cb) {
	var collection = db.get().collection('photos');
	collection.findOne({_id: id}, cb);
};

exports.fromEvent = function(eventId, cb) {
	var collection = db.get().collection('photos');
	collection.find({eventId: eventId}, cb);
};

exports.all = function(cb) {
	var collection = db.get().collection('photos');
	collection.find({}, cb);
};
