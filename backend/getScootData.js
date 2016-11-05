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
  port: config.db.port,
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};


var pool = new pg.Pool(pgConfig);

// TODO promisify everything

function insertData() {
    var ts_str = (new Date()).toUTCString();
    console.log(ts_str);


    request({
        url: scootApiEndpoint,
        json: true
    }, function (error, response, body) {

        if (!error && response.statusCode === 200) {

            pool.connect(function (err, client, done) {
                if(err) {
                    return console.error('error fetching client from pool', err);
                }

                var queryStr = 'INSERT INTO snapshot (data) VALUES ($1::jsonb)';

                client.query(queryStr, [body], function(err, result) {
                    //call `done()` to release the client back to the pool
                    done();

                    if(err) {
                        return console.error('error running query', err);
                    }

                    console.log(ts_str + ": Inserted data");
                    console.log(result);
                    //output: 1
                });

            });

        } else {
            console.error(error);
            console.error(response.statusCode);
        }
    });
}

pool.on('error', function (err, client) {
    // if an error is encountered by a client while it sits idle in the pool
    // the pool itself will emit an error event with both the error and
    // the client which emitted the original error
    // this is a rare occurrence but can happen if there is a network partition
    // between your application and the database, the database restarts, etc.
    // and so you might want to handle it and at least log it out
    console.error('idle client error', err.message, err.stack)
})






var minutes = 1; 
var the_interval = minutes * 60 * 1000;

insertData();
setInterval(insertData, the_interval);
