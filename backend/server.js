var express = require('express');
var config = require('config');

var app = express();
var port = process.env.PORT || 8080;



var MongoClient = require('mongodb').MongoClient;

var dbHost = config.get('db.host');
var dbPort = config.get('db.port');

var clientHost = config.get('client.host');
var clientPort = config.get('client.port');

var mongodb_url = "mongodb://" + dbHost + ":" + dbPort;
var client_url = "http://" + clientHost + ":" + clientPort;


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

		// TODO
		// - reverse by _id, have the latest timestamp show up first in list
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

					// set headers
					res.set('Access-Control-Allow-Origin', client_url);
					res.json({"status": "success", "data": data});
				} else {
					console.log(err);
					res.json({"status": "error", "err": err});
				}
				db.close();
			});


		});
	});
});

console.log("Listening on port " + port);
app.listen(port);
