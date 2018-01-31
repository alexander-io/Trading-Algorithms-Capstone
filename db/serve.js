let express = require('express'),
  mongo = require('mongodb'),
  url = 'mongodb://localhost:27017'

let app = express(),
  mongoclient = mongo.MongoClient,
  port = 8080

const dbName = 'crypto_trading'

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
mongo.connect(url, function(err, client) {
  console.log('successfully connected to server')
  const  db = client.db(dbName)
  insert({'entry' : 'entryone'}, 'first_collection', db)
  client.close()
})


// app.get('/')

app.listen(port, function() {
  console.log('i can hear port', port)
})
