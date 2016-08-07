# Running app
To run the server locally:

- `npm install`
- Load data to db. Each document in collection should be structured like `sample.json`
- Edit config/default.json
- `node server.js`


# TODO

- Response size getting too big.  Ideas to address this:
    - Data Representation:
        - Forego using 'long'/'lat' keys in json, etc.)?
        - Respond with diffs in data between time intervals, instead of 'snapshots'?
            Will remove a lot of redundant data as many locations don't change often between minutes.
    - General compression:
        - JSON compression should be a huge change. (lot of repetitive text in JSON)


- Related to above: response is taking too long.
    - Somehow 'stream' data instead?
    - Chunking?
    - Can this also be addressed on client side? Client might not need to request all data at once.



- Can we make code faster? (not really an issue, but fun to think about!).
    - Check if there's any efficiencies in our code.
    - Explore other languages/technologies besides node.js.

