var request = require("request");
var MongoClient = require('mongodb').MongoClient;
var moment = require("moment");
var config = require("./config");


var scootApiEndpoint = config.scootApiEndpoint;
var mongodb_uri = config.mongoDbUri;

request({
	url: scootApiEndpoint,
	json: true
}, function (error, response, body) {

	if (!error && response.statusCode === 200) {

      // push json to mongodb
      var now = moment(new Date()).format("MMDDYYYYHH");

      MongoClient.connect(mongodb_uri, function(err, db) {
      	var scootstats = db.collection('scootstats');
     	scootstats.insert({ _id: now , data: body})
      	db.close();
      });
  }
});