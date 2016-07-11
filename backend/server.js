var express = require('express');
var config = require('./config');

var app = express();
var port = process.env.PORT || 8080; 
var MongoClient = require('mongodb').MongoClient;
var mongodb_url = config.mongoDbUri;

app.get("/:date", function(req,res){
	
	MongoClient.connect(mongodb_url, function(err, db) {

		var scootstats = db.collection('scootstats');

		scootstats.find({}, function(err, cursor){
			
			cursor.toArray(function(err,items){
				var data = items[0];

				if(data != null){
					res.json({"status": "success", "data": data});
				} else{
					res.json({"status": "error", "data": {}});
				}
			});

			db.close();
			
		});
	});
});

app.listen(port);
