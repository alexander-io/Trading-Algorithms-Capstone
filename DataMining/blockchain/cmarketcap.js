let request = require('request')

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
      console.log(info)
      // for (let x = 0; x < info.length; x++) {
      //     console.log(info.items[x])
      // }
    }
  }
  request(options, callback )
}
x()
