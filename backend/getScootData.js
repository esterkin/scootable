var pg = require('pg');
var request = require("request");
var moment = require("moment");
var config = require('./config.json')[process.env.NODE_ENV || 'development'];
var scootApiEndpoint = config.scootApiEndpoint;

var pgConfig = {
  user: config.db.user, 
  database: config.db.name,
  password: config.db.password,
  host: config.db.host,
  port: config.db.port
};

// TODO promisify everything

function insertData() {
    var client = new pg.Client(pgConfig);
    var ts_str = (new Date()).toUTCString();
    console.log(ts_str + ": Called insertData()");

    request({
        url: scootApiEndpoint,
        json: true
    }, function (error, response, body) {


        if (!error && response.statusCode === 200) {
            var ts_str = (new Date()).toUTCString();
            console.log(ts_str + ": Retreived json from scoot api");

            // connect to our database
            client.connect(function (err) {
                if (err) {
                    console.log(err);
                    throw err;
                }

                var queryStr = 'INSERT INTO snapshot (data) VALUES ($1::jsonb)';
                // execute a query on our database
                client.query(queryStr, [body], function(err, result) {
                    if (err) {
                        console.log(err);
                        throw err;
                    }

                    var ts_str = (new Date()).toUTCString();
                    console.log(ts_str + ": Performed query");
                    console.log(result);

                    // disconnect the client
                    client.end(function (err) {
                        if (err) {
                            console.log(err);
                            throw err;
                        }
                    });
                });
            });

        } else {
            console.error(error);
            console.error(response.statusCode);
        }
    });
}


var minutes = 1;
var the_interval = minutes * 60 * 1000;

insertData();
setInterval(insertData, the_interval);
