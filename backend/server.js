var express = require('express');

var app = express();

var config = require('./config.json')[process.env.NODE_ENV || 'development'];

var dbHost = config.db.host;
var dbPort = config.db.port;



var port = process.env.PORT || config.server.port || 8080;

var clientHost = config.client.host;
var clientPort = config.client.port;


var MongoClient = require('mongodb').MongoClient;

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
								long: scooter.longitude,
								lat: scooter.latitude
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
