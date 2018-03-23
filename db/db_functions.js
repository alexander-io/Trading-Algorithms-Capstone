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
    /*
     * funx get_wiki_views_where_pagetitle
     * @param pagetitle, the Wikipedia official page title
     *  ex : if (wiki_url == 'https://en.wikipedia.org/wiki/Ethereum') let pagetitle = 'Ethereum'
     */
    get_array_wiki_views_where_pagetitle :  function(pagetitle) {
      let query = {"pagetitle" : pagetitle}
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
    /*
     * funx get_array_coinmarketcap_data_where_currency_title
     * @param currency_title, select from db.coinmarketcap_ticker by currency_title
     *  ex : if (currency_title == 'ethereum') return collection.coinmarketcap_ticker where id is 'ethereum'
     */
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
    },

    get_earliest_coinmarketcap_data_entry_where_currency_title : function(currency_title) {
      let query = {"id" : currency_title}
      return new Promise(function(resolve, reject) {
        mongo.connect(url, function(err, client) {
          if (err) {console.log(err);reject(err)}
          let x = client.db(dbName).collection('coinmarketcap_ticker').find(query).sort({unix_time : 1}).limit(1).toArray()
          client.close()
          resolve(x)
        })
      })
    },

    get_most_recent_coinmarketcap_data_entry_where_currency_title : function(currency_title) {
      let query = {"id" : currency_title}
      return  new Promise((resolve, reject) => {
        mongo.connect(url, (err,  client) => {
          if (err) {console.log(err); reject(err)}
          let x  = client.db(dbName).collection('coinmarketcap_ticker').find(query).sort({unix_time : -1}).limit(1).toArray()
          client.close()
          resolve(x)
        })
      })
    },
    get_unix_time_differential_earliest_vs_most_recent_where_currency_title : function(currency_title) {
      return new Promise((resolve, reject) => {
        try {
          this.get_most_recent_coinmarketcap_data_entry_where_currency_title(currency_title).then((recent_resolution, recent_rejection) => {
            this.get_earliest_coinmarketcap_data_entry_where_currency_title(currency_title).then((earliest_resolution, earliest_rejection) => {
              if (recent_resolution && earliest_resolution) {
                let most_recent_entry_timestamp = recent_resolution[0].unix_time
                let earliest_entry_timestamp = earliest_resolution[0].unix_time
                // console.log(most_recent_entry_timestamp)
                // console.log(earliest_entry_timestamp)
                resolve(most_recent_entry_timestamp-earliest_entry_timestamp)
              }
            })
          })
        } catch (e) {
           reject(e)
        }
      })
      // let query = {"id" : currency_title}
      // return  new Promise((resolve, reject) => {
      //   mongo.connect(url, (err,  client) => {
      //     if (err) {console.log(err); reject(err)}
      //     let   = client.db(dbName).collection('coinmarketcap_ticker').find(query).sort({unix_time : -1}).limit(1).toArray()
      //     client.close()
      //     resolve(x)
      //   })
      // })
    }
  }

  // SANDBOX for unit testing
  let coins_wiki_titles = ['Bitcoin', 'Litecoin', 'Bitcoin_Cash', 'Ripple_(payment_protocol)', 'Dogecoin', 'Ethereum']
  let coins_lowercase = ['bitcoin', 'litecoin', 'ripple', 'bitcoin-cash', 'ethereum']

  // TEST get_earliest_coinmarketcap_data_entry_where_currency_title()
  // module.exports.get_earliest_coinmarketcap_data_entry_where_currency_title('ethereum').then((resolution, rejection) => {
  //   console.log(resolution)
  // })

  // TEST get_most_recent_coinmarketcap_data_entry_where_currency_title()
  // module.exports.get_most_recent_coinmarketcap_data_entry_where_currency_title('ethereum').then((resolution, rejection) => {
  //   console.log(resolution)
  // })

  // TEST get_unix_time_differential_earliest_vs_most_recent_where_currency_title()
  // module.exports.get_unix_time_differential_earliest_vs_most_recent_where_currency_title('ethereum').then((resolution, rejection) => {
  //
  // })

  module.exports.get_unix_time_differential_earliest_vs_most_recent_where_currency_title('ethereum').then(function(resolution, rejection) {
    if (resolution) {
      console.log(resolution)
    } else console.log(rejection)
  })
}())
