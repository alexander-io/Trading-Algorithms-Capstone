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
<<<<<<< HEAD
    /*
     * funx get_wiki_views_where_pagetitle
     * @param pagetitle, the Wikipedia official page title
     *  ex : if (wiki_url == 'https://en.wikipedia.org/wiki/Ethereum') let pagetitle = 'Ethereum'
     */
    get_array_wiki_views_where_pagetitle :  function(pagetitle) {
      let query = {"pagetitle" : pagetitle}
=======
    get_wiki_views_where_pagetitle :  function(pagetitle) {
      var query = {"pagetitle" : pagetitle}
>>>>>>> a65eda3a82669286523772e1a43ffdfba6bd7783
      return new Promise(function(resolve, reject) {
        mongo.connect(url, function(err, client) {
          if (err) {console.log(err);reject(err)}
          var collection = client.db(dbName).collection('wiki_views')
          var x = collection.find(query).toArray()
          client.close()
          resolve(x)
        })
      })
    },
    get_array_coinmarketcap_data_where_currency_title : function(currency_title) {
      let query = {"id" : currency_title}
      return new Promise(function(resolve, reject) {
        mongo.connect(url, function(err, client) {
          if (err) {console.log(err);reject(err)}
          let collection = client.db(dbName).collection('coinmarketcap_ticker')
          let x  = collection.find(query).toArray()
          client.close()
          if (x.length != 0) {
            resolve(x)
          } else { reject('err')}
        })
      })
    }
  }

  var map_of_coin_to_array_data = {}

  let coins_wiki_titles = ['Bitcoin', 'Litecoin', 'Bitcoin_Cash', 'Ripple_(payment_protocol)', 'Dogecoin', 'Ethereum']

  let coins_lowercase = ['bitcoin', 'litecoin', 'ripple', 'bitcoin-cash', 'ethereum']

  coins_lowercase.forEach((x) => map_of_coin_to_array_data[x] = null)

  // console.log(map_of_coin_to_array_data)



  for (x in map_of_coin_to_array_data) {
    console.log(x)
    map_of_coin_to_array_data[x] = null
  }

  var coins = ['Bitcoin', 'Litecoin', 'Bitcoin_Cash', 'Ripple_(payment_protocol)', 'Dogecoin', 'Ethereum']
  coins.forEach(function(x) {
    module.exports.get_wiki_views_where_pagetitle(x).then(function(resolve, reject) {
      console.log(resolve)
    })
  })
}())
