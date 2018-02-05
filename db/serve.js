let express = require('express'),
  mongo = require('mongodb'),
  url = 'mongodb://localhost:27017'

let app = express(),
  mongoclient = mongo.MongoClient,
  port = 8080

const dbName = 'crypto_trading'

/**
 * insert a document into the database
 * @param entry, json object to enter to db
 * @param collection_title, title of the collection/table to receive the insertion
 * @param db, db object that's generated through the mongo.connect() function call
 * @param callback, (optional) a callback function to exec when completed
 */
let insert = function(entry, collection_title, db, callback) {
  let collection = db.collection(collection_title)
  collection.insert(entry, function(err, result) {
    if (err) {
      console.log(err)
    } else {
      console.log('inserted ', entry)
    }
  })
}


// before doing db operations, connect first
mongo.connect(url, function(err, client) {
  console.log('successfully connected to server')
  const  db = client.db(dbName)

  insert({'entry' : 'entryone'}, 'first_collection', db)
  client.close()
})

app.listen(port, function() {
  console.log('i can hear port', port)
})
