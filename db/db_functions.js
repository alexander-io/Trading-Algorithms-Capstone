(function(){

  // require mongo, define host:port, define mongoclient
  var mongo = require('mongodb'),
    url = 'mongodb://localhost:27017'
  var  mongoclient = mongo.MongoClient

  // define database title
  const dbName = 'crypto_trading'

  // define insert function
  module.exports = {    insert : function(entry, collection_title/*, db, callback*/) {
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
          var x = collection.find(query).toArray((err, docs) => {
            client.close()
            resolve(docs)
          })
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
          let x = client.db(dbName).collection('coinmarketcap_ticker').find(query).toArray((err, docs) => {
            client.close()
            resolve(docs)
          })
        })
      })
    },
    get_earliest_coinmarketcap_data_entry_where_currency_title : function(currency_title) {
      let query = {"id" : currency_title}
      return new Promise(function(resolve, reject) {
        mongo.connect(url, function(err, client) {
          if (err) {console.log(err);reject(err)}
          let x = client.db(dbName).collection('coinmarketcap_ticker').find(query).toArray((err, docs) => {
            client.close()
            let min = docs[0]
            for (let i = 0; i < docs.length; i++) {
              if (docs[i].unix_time < min.unix_time) {
                min = docs[i]
              }
            }
            resolve(min)
          })
        })
      })
    },
    get_most_recent_coinmarketcap_data_entry_where_currency_title : function(currency_title) {
      let query = {"id" : currency_title}
      return  new Promise((resolve, reject) => {
        mongo.connect(url, (err,  client) => {
          if (err) {console.log(err); reject(err)}
          let x  = client.db(dbName).collection('coinmarketcap_ticker').find(query).toArray((err, docs) => {
            client.close()
            let max = docs[0]
            for (let i = 0; i < docs.length; i ++) {
              if (docs[i].unix_time > max.unix_time) {
                max = docs[i]
              }
            }
            resolve(max)
          })
        })
      })
    },
    get_cmarketcap_unix_time_differential_earliest_vs_most_recent_where_currency_title : function(currency_title) {
      return new Promise((resolve, reject) => {
        try {
          this.get_most_recent_coinmarketcap_data_entry_where_currency_title(currency_title).then((recent_resolution, recent_rejection) => {
            this.get_earliest_coinmarketcap_data_entry_where_currency_title(currency_title).then((earliest_resolution, earliest_rejection) => {
              if (recent_resolution && earliest_resolution) {
                let most_recent_entry_timestamp = recent_resolution.unix_time
                let earliest_entry_timestamp = earliest_resolution.unix_time
                resolve(most_recent_entry_timestamp-earliest_entry_timestamp)
              }
            })
          })
        } catch (e) {
           reject(e)
        }
      })
    },
    get_cmarketcap_hours_time_differential_earliest_vs_most_recent_where_currency_title : function(currency_title) {
      return new Promise((resolve, reject) => {
        try {
          this.get_cmarketcap_unix_time_differential_earliest_vs_most_recent_where_currency_title(currency_title).then((unix_time_differential, rejection) => {
            resolve(unix_time_differential / (1000*60*60) % 24)
          })
        } catch (e) {
          reject(e)
        }
      })
    },
    get_earliest_data_entry_where_collection_AND_query : function(collection_title, query) {
      return new Promise((resolve, reject) => {
        mongo.connect(url, (err, client) => {
          if (err) {console.log(err); reject(err)}
          let x = client.db(dbName).collection(collection_title).find(query).sort({unix_time : 1}).limit(1).toArray()
          client.close()
          resolve(x)
        })
      })
    },
    get_most_recent_data_entry_where_collection_AND_query : function(collection_title, query) {
      return new Promise((resolve, reject) => {
        mongo.connect(url, (err, client) => {
          if (err) {console.log(err); reject(err)}
          let x = client.db(dbName).collection(collection_title).find(query).sort({unix_time : -1}).limit(1).toArray()
          client.close()
          resolve(x)
        })
      })
    },
    get_unix_time_differential_earliest_vs_most_recent_where_collection_AND_query : function(collection_title, query) {
      return new Promise((resolve, reject) => {
        try {
          this.get_earliest_data_entry_where_collection_AND_query(collection_title, query).then((earliest_resolution, earliest_rejection) => {
            this.get_most_recent_data_entry_where_collection_AND_query(collection_title, query).then((most_recent_resolution, most_recent_rejection) => {
              let earliest_unix_timestamp = earliest_resolution[0].unix_time
              let most_recent_unix_timestamp = most_recent_resolution[0].unix_time
              resolve(most_recent_unix_timestamp - earliest_unix_timestamp)
            })
          })
        } catch (e) {
          reject(e)
        }
      })
    },
    get_hour_time_differential_earliest_vs_most_recent_where_collection_AND_query : function(collection_title, query) {
      return new Promise((resolve, reject) => {
        try {
            this.get_unix_time_differential_earliest_vs_most_recent_where_collection_AND_query(collection_title, query).then((unix_time_differential, rejection) => {
              resolve(unix_time_differential / (1000*60*60) % 24)
            })
        } catch (e) {
          reject(e)
        }
      })
    },
    get_num_entries_where_collection_AND_query : function(collection_title, query) {
      return new Promise((resolve, reject) => {
        mongo.connect(url, (err, client) => {
          if (err) {console.log(err); reject(err)}
          let x  = client.db(dbName).collection(collection_title).find(query).count()
          // console.log(x)
          client.close()
          resolve(x)
        })
      })
    },
    get_wiki_entry_highest_views_where_pagetitle : function(pagetitle) {
      let query = {"pagetitle" : pagetitle}
      return new Promise((resolve, reject) => {
        mongo.connect(url, (err, client) => {
          if (err) {console.log(err); reject(err)}
          let x = client.db(dbName).collection('wiki_views').find(query).sort({views : -1}).limit(1).toArray()
          client.close()
          resolve(x)
        })
      })
    },
    get_wiki_entry_lowest_views_where_pagetitle : function(pagetitle) {
      let query = {"pagetitle" : pagetitle}
      return new Promise((resolve, reject) => {
        mongo.connect(url, (err, client) => {
          if (err) {console.log(err); reject(err)}
          let x = client.db(dbName).collection('wiki_views').find(query).sort({views : 1}).limit(1).toArray()
          client.close()
          resolve(x)
        })
      })
    },
    get_cmarketcap_highest_price_usd : function(currency_title) {
      let query = {"id" : currency_title}
      return new Promise((resolve, reject) => {
        mongo.connect(url, (err, client) => {
          if (err) {console.log(err); reject(err)}
          // let x = client.db(dbName).collection('coinmarketcap_ticker').find(query).sort({price_usd : -1}).limit(1).toArray()
          let x = client.db(dbName).collection('coinmarketcap_ticker').find(query).toArray(function(err, docs) {
            if (err) {console.lent.close()
            resoog(err); reject(err)}
            client.close()
            let max = docs[0]
            for (let i = 0; i < docs.length; i++) {
              if (parseInt(docs[i].price_usd) > parseInt(max.price_usd)) {
                max = docs[i]
              }
            }
            resolve(max)
          })
        })
      })
    },
    get_cmarketcap_lowest_price_usd : function(currency_title) {
      let query = {"id" : currency_title}
      return new Promise((resolve, reject) => {
        mongo.connect(url, (err, client) => {
          if (err) {console.log(err); reject(err)}
          let x = client.db(dbName).collection('coinmarketcap_ticker').find(query).toArray((err, docs) => {
            client.close()
            let min = docs[0]
            for (let i = 0; i < docs.length; i++) {
              if (parseInt(docs[i].price_usd) < parseInt(min.price_usd)) {
                min = docs[i]
              }
            }
            resolve(min)

          })
        })
      })
    },
    get_cm_array_where_currency_title : function(currency_title) {
      let query = {"id" : currency_title}
      return new Promise((resolve, reject) => {
        mongo.connect(url, (err, client) => {
          if (err) {console.logent.close()
            reso(err); reject(err)}
          let x = client.db(dbName).collection('coinmarketcap_ticker').find(query).toArray(function(err, docs) {
            resolve(docs)
            client.close()
          })
        })
      })
    },
    seconds_to_hours : function(seconds) {
      return seconds/3600
    },
    seconds_to_days : function(seconds) {
      let hours = seconds/3600
      let days = hours/24
      return days
    },
    ms_to_seconds : function(ms) {
      return ms/1000
    },
    ms_to_hours : function(ms) {
      let seconds = ms/1000
      let hours = seconds/3600
      return hours
    },
    ms_to_days : function(ms) {
      let seconds = ms/1000
      let hours = seconds/3600
      let days = hours/24
      return days
    }
  }

  // SANDBOX for unit testing
  let coins_wiki_titles = ['Bitcoin', 'Litecoin', 'Bitcoin_Cash', 'Ripple_(payment_protocol)', 'Dogecoin', 'Ethereum']
  let coins_lowercase = ['bitcoin', 'litecoin', 'ripple', 'bitcoin-cash', 'ethereum']

  let unix_to_date_string = function(unix_time_ms) {
        var date = new Date(unix_time_ms);

        let month = date.getMonth()
        let day_of_month = date.getDate()
        let hours = date.getHours()
        let minutes = "0" + date.getMinutes()
        let seconds = "0" + date.getSeconds()

        let formattedTime = 'month:'+month+'\ndate:'+day_of_month+'\n'+hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
        return formattedTime
  }



  let unix_to_num_days = function(unix_time_ms) {
    return unix_time_ms/86400000.00007714
  }


  // module.exports.get_cmarketcap_highest_price_usd('bitcoin-cash').then((resolution, rejection) => {
  //   console.log(resolution)
  //   console.log(unix_to_date_string(resolution.unix_time))
  // })

  // module.exports.get_cmarketcap_lowest_price_usd('bitcoin-cash').then((resolution, rejection) => {
  //   console.log(resolution)
  //   console.log(unix_to_date_string(resolution.unix_time))
  // })

  // module.exports.get_cmarketcap_hours_time_differential_earliest_vs_most_recent_where_currency_title('bitcoin-cash').then((resolution, rejection) => {
  //   console.log(resolution)
  // })

  module.exports.get_earliest_coinmarketcap_data_entry_where_currency_title('bitcoin-cash').then((resolution, rejection) => {
    console.log('earliest', resolution)
    console.log(unix_to_date_string(resolution.unix_time))
  })

  module.exports.get_most_recent_coinmarketcap_data_entry_where_currency_title('bitcoin-cash').then((resolution, rejection) => {
    console.log('earliest', resolution)
    console.log(unix_to_date_string(resolution.unix_time))
  })

  module.exports.get_cmarketcap_unix_time_differential_earliest_vs_most_recent_where_currency_title('bitcoin-cash').then((resolution, rejection) => {
    console.log(module.exports.ms_to_hours(resolution))
  })

  // module.exports.get_cmarketcap_unix_time_differential_earliest_vs_most_recent_where_currency_title('bitcoin-cash').then((resolution, rejection) => {
  //   console.log(resolution)
  // })

  // module.exports.get_cmarketcap_lowest_price_usd('bitcoin-cash').then((resolution, rejection) => {
  //   console.log(resolution)
  // })

  // module.exports.aggregate_cmarketcap_highest_price_usd().then((resolution, rejection) => {
  //   console.log(resolution)
  // })


  // module.exports.get_cmarketcap_highest_price_usd('bitcoin-cash').then((resolution, rejection) => {
  //   console.log('highest price :', resolution)
  // })
  // module.exports.get_cmarketcap_lowest_price_usd('bitcoin-cash').then((resolution, rejection) => {
  //   console.log('lowest price :',resolution)
  // })

  // module.exports.get_earliest_coinmarketcap_data_entry_where_currency_title('bitcoin').then((resolution, rejection) => {
  //   console.log(resolution)
  //   console.log(unix_to_date_string(resolution[0].unix_time))
  // })
  //
  // module.exports.get_most_recent_coinmarketcap_data_entry_where_currency_title('bitcoin').then((resolution, rejection) => {
  //   console.log(resolution)
  //   console.log(unix_to_date_string(resolution[0].unix_time))
  // })
  //
  // module.exports.get_cmarketcap_unix_time_differential_earliest_vs_most_recent_where_currency_title('bitcoin').then((resolution, rejection) => {
  //   console.log(unix_to_num_days(resolution))
  // })


  // module.exports.get_array_coinmarketcap_data_where_currency_title('bitcoin-cash').then((resolution, rejection) => {
  //   // console.log(resolution)
  // })
  //
  // module.exports.get_cmarketcap_highest_price_usd('bitcoin').then((resolution, rejection) => {
  //   console.log('highest price :', resolution)
  // })
  // module.exports.get_cmarketcap_lowest_price_usd('bitcoin').then((resolution, rejection) => {
  //   console.log('lowest price :',resolution)
  // })

  // coins_lowercase.forEach((x) => {
  //   module.exports.get_cmarketcap_highest_price_usd(x).then((resolution, rejection) => {
  //     console.log('\nhighest price in usd for : ' + x, resolution)
  //     var date = new Date(resolution[0].last_updated*1000);
  //
  //     let month = date.getMonth()
  //     let day_of_month = date.getDate()
  //     let hours = date.getHours()
  //     let minutes = "0" + date.getMinutes()
  //     let seconds = "0" + date.getSeconds()
  //
  //     let formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  //
  //     console.log('month :', month)
  //     console.log('date :', day_of_month)
  //     console.log('time :', formattedTime)
  //   })
  // })

  // coins_lowercase.forEach((x) => {
  //   module.exports.get_cmarketcap_lowest_price_usd(x).then((resolution, rejection) => {
  //     console.log('\nlowest price in usd for : ' + x, resolution)
  //     var date = new Date(resolution[0].last_updated*1000);
  //
  //     let month = date.getMonth()
  //     let day_of_month = date.getDate()
  //     let hours = date.getHours()
  //     let minutes = "0" + date.getMinutes()
  //     let seconds = "0" + date.getSeconds()
  //
  //     let formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  //
  //     console.log('month :', month)
  //     console.log('date :', day_of_month)
  //     console.log('time :', formattedTime)
  //   })
  // })

  // TEST get_earliest_coinmarketcap_data_entry_where_currency_title()
  // module.exports.get_earliest_coinmarketcap_data_entry_where_currency_title('ethereum').then((resolution, rejection) => {
  //   console.log(resolution)
  // })

  // TEST get_most_recent_coinmarketcap_data_entry_where_currency_title()
  // module.exports.get_most_recent_coinmarketcap_data_entry_where_currency_title('ethereum').then((resolution, rejection) => {
  //   console.log(resolution)
  // })

  // TEST get_cmarketcap_unix_time_differential_earliest_vs_most_recent_where_currency_title()
  // module.exports.get_cmarketcap_unix_time_differential_earliest_vs_most_recent_where_currency_title('ethereum').then(function(resolution, rejection) {
  //   if (resolution) {
  //     console.log('unix time differential', resolution)
  //   } else console.log(rejection)
  // })

  // TEST get_cmarketcap_hours_time_differential_earliest_vs_most_recent_where_currency_title()
  // module.exports.get_cmarketcap_hours_time_differential_earliest_vs_most_recent_where_currency_title('ethereum').then((hour_time_differential, rejection) => {
  //   hour_time_differential ? console.log('hour time  differential', hour_time_differential) : console.log(rejection)
  // })

  // TEST get_earliest_data_entry_where_collection_AND_query
  // module.exports.get_earliest_data_entry_where_collection_AND_query('wiki_views', {pagetitle : 'Litecoin'}).then((resolution, rejection) => {
  //   resolution ? console.log(resolution) : console.log(rejection)
  // })

  // TEST get_most_recent_data_entry_where_collection_AND_query()
  // module.exports.get_most_recent_data_entry_where_collection_AND_query('wiki_views', {pagetitle : 'Litecoin'}).then((resolution, rejection) => {
  //   resolution ? console.log(resolution) : console.log(rejection)
  // })

  // TEST  get_unix_time_differential_earliest_vs_most_recent_where_collection_AND_query()
  // module.exports.get_unix_time_differential_earliest_vs_most_recent_where_collection_AND_query('wiki_views', {pagetitle : 'Litecoin'}).then((resolution, rejection) => {
  //   resolution ? console.log('unix time differential', resolution) : console.log(rejection)
  // })

  // TEST get_hour_time_differential_earliest_vs_most_recent_where_collection_AND_query()
  // module.exports.get_hour_time_differential_earliest_vs_most_recent_where_collection_AND_query('wiki_views', {pagetitle : 'Litecoin'}).then((resolution, rejection) => {
  //   resolution ? console.log('hour time differential between eariest and most recent Litecoin wiki_views entries :', resolution) : console.log(rejection)
  // })

  // TEST get_num_entries_where_collection_AND_query()
  // module.exports.get_num_entries_where_collection_AND_query('wiki_views', {pagetitle : 'Litecoin'}).then((resolution, rejection) => {
  //   console.log('number of wiki_views Litecoin entries :', resolution)
  // })


  // TEST get_wiki_entry_highest_views_where_pagetitle()
  // module.exports.get_wiki_entry_highest_views_where_pagetitle('Ethereum').then((resolution, rejection) => {
  //   console.log('entry with highest views for ethereum :', resolution)
  // })

  // TEST get_wiki_entry_lowest_views_where_pagetitle()
  // module.exports.get_wiki_entry_lowest_views_where_pagetitle('Ethereum').then((resolution, rejection) => {
  //   console.log('entry with lowest views for ethereum :', resolution)
  // })

}())
