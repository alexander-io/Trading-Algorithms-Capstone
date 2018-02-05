(function(){

  let mongo = require('mongodb'),
    url = 'mongodb://localhost:27017'
  let  mongoclient = mongo.MongoClient

  const dbName = 'crypto_trading'

  module.exports = insert = function(entry, collection_title/*, db, callback*/) {
    mongo.connect(url, function(err, client) {
        console.log('successfully connected to server')
        const db = client.db(dbName)

        let collection = db.collection(collection_title)

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

  insert({'test' : 'entry'}, 'test_collection')

}())
