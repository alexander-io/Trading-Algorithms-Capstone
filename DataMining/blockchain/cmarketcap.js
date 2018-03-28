var request = require('request')
var funx = require(__dirname + '/../../db/db_functions.js')

var x = function() {
  var req_url = 'https://api.coinmarketcap.com/v1/ticker/'

  var options =  {
    url : req_url,
    headers : {
      'User-Agent' : 'request'
    }
  }

  var callback = function(error, response, body) {
    let d = new Date()
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body)
      for (var x = 0; x < info.length;x++) {
        if (
          info[x].id == 'bitcoin'
          || info[x].id == 'ethereum'
          || info[x].id == 'ripple'
          || info[x].id == 'litecoin'
          || info[x].id == 'bitcoin-cash'
        ) {
          info[x].unix_time = Date.now()
          info[x].post_created_time_hour = d.getHours()
          info[x].post_created_time_minute = d.getMinutes()
          info[x].price_usd_int = parseInt(info[x].price_usd)
          funx.insert(info[x], 'coinmarketcap_ticker' /* collection title */)
        }
      }
    }
  }
  request(options, callback)
}
x()
