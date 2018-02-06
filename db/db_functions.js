(function(){

  // require mongo, define host:port, define mongoclient
  let mongo = require('mongodb'),
    url = 'mongodb://localhost:27017'
  let  mongoclient = mongo.MongoClient

  // define database title
  const dbName = 'crypto_trading'

  // define insert function
  module.exports = insert = function(entry, collection_title/*, db, callback*/) {
    mongo.connect(url, function(err, client) {
        console.log('successfully connected to server')
        // define db & collection
        const db = client.db(dbName)
        let collection = db.collection(collection_title)
        // insert entry into db collection
        collection.insert(entry, function(err, result) {
          if (err) {
            console.log('error', err)
          } else {
            console.log('inserted ' + entry)
          }
        })
        client.close()
    })
  }
}())
