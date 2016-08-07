var request = require("request");
var MongoClient = require('mongodb').MongoClient;
var moment = require("moment");
var config = require('config');

var dbHost = config.get('db.host');
var dbPort = config.get('db.port');

var scootApiEndpoint = config.get('scootApiEndpoint');
var mongodb_uri = "mongodb://" + dbHost + ":" + dbPort;


var minutes = 1, the_interval = minutes * 60 * 1000;
setInterval(function() {
  console.log("I am doing my 1 minutes check");


  request({
	  url: scootApiEndpoint,
	  json: true
  }, function (error, response, body) {

	  if (!error && response.statusCode === 200) {

	// push json to mongodb
	    // TODO check if this is UTC
	var now = moment().unix();

	MongoClient.connect(mongodb_uri, function(err, db) {
	  var scootstats = db.collection('scootstats');
	  scootstats.insert({ _id: now , data: body});
	  db.close();
	});
    }
  });
}, the_interval);
