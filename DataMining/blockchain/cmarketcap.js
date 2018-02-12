let request = require('request')

let db_insert = require(__dirname + '/../../db/db_functions.js')

let x = function() {
  let req_url = 'https://api.coinmarketcap.com/v1/ticker/'

  let options =  {
    url : req_url,
    headers : {
      'User-Agent' : 'request'
    }
  }

  let callback = function(error, response, body) {
    if (!error && response.statusCode == 200) {
      let info = JSON.parse(body)
      for (let x = 0; x < info.length;x++) {
        if (
          info[x].id == 'bitcoin'
          || info[x].id == 'ethereum'
          || info[x].id == 'ripple'
          || info[x].id == 'litecoin'
          || info[x].id == 'bitcoin-cash'
        ) {
          // TODO insert json into db
        }
      }
    }
  }
  request(options, callback)
}
x()
