Events = require('../models/events.js');

module.exports = function(app) {

	app.post('/events/create', function(req, res) {
		Events.create(req.body.name, function(err, result) {
			if (err) {
				console.log(err);
			} else {
				eventId = result.ops[0]._id;
				res.json({ 'status': "Success", 'eventId': eventId });
			}
		});
	});

	app.get('/events', function(req, res) {
		Events.all(function(err, docs) {
			docs.toArray(function(err, els) {
				res.json({ events: els });
			});
		});
	});
};
