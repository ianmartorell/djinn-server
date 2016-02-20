var db = require('../db');

exports.create = function(name, cb) {
	var collection = db.get().collection('events');
	var event = {
		name: name,
		date: new Date().toString()
	};
	collection.save(event, cb);
};

exports.get = function(id, cb) {
	var collection = db.get().collection('events');
	collection.findOne({_id: id}, cb);
};

exports.all = function(cb) {
	var collection = db.get().collection('events');
	collection.find({}, cb);
};
