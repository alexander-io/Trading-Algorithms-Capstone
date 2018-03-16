(function(){

  // require mongo, define host:port, define mongoclient
  var mongo = require('mongodb'),
    url = 'mongodb://localhost:27017'
  var  mongoclient = mongo.MongoClient

  // define database title
  const dbName = 'crypto_trading'

  // define insert function
  module.exports = {
    insert : function(entry, collection_title/*, db, callback*/) {
      mongo.connect(url, function(err, client) {
          console.log('successfully connected to server')
          // define db & collection
          const db = client.db(dbName)
          var collection = db.collection(collection_title)
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
      },
    get_wiki_views_where_pagetitle :  function(pagetitle) {
      var query = {"pagetitle" : pagetitle}
      return new Promise(function(resolve, reject) {
        mongo.connect(url, function(err, client) {
          if (err) {console.log(err);reject(err)}
          var collection = client.db(dbName).collection('wiki_views')
          var x = collection.find(query).toArray()
          client.close()
          resolve(x)
        })
      })
    }
  }

  var coins = ['Bitcoin', 'Litecoin', 'Bitcoin_Cash', 'Ripple_(payment_protocol)', 'Dogecoin', 'Ethereum']
  coins.forEach(function(x) {
    module.exports.get_wiki_views_where_pagetitle(x).then(function(resolve, reject) {
      console.log(resolve)
    })
  })
}())
