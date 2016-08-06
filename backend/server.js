var express = require('express');
var config = require('./config');

var app = express();
var port = process.env.PORT || 8080; 
var MongoClient = require('mongodb').MongoClient;
var mongodb_url = config.mongoDbUri;


// TODO 
// - address potential malicious input
app.get("/locations", function(req,res){

	MongoClient.connect(mongodb_url, function(err, db) {

		var scootstats = db.collection('scootstats');
		opts = {}

		// Use params.limit to get number of entries to limit
		if (req.query.n) {
			var limit = parseInt(req.query.n);
			opts.limit = limit;
		}

		scootstats.find({}, opts, function(err, cursor){

			cursor.toArray(function(err,items){
				if(items != null){
					// retreive 'data' field from result.  Yes it's a bit confusing...
					var data = items.map(function(item) {
						var scooters = item.data.scooters;
						// only output the longitude/latitude
						var locations = scooters.map(function(scooter) {
							return {
								longitude: scooter.longitude,
								latitude: scooter.latitude
							};
						});

						return {_id: item._id, locations: locations};
					});

					res.json({"status": "success", "data": data});
				} else {
					res.json({"status": "error", "data": {}});
				}
			});

			db.close();

		});
	});
});

app.listen(port);
