//http://tools.wmflabs.org/pageviews/?project=en.wikipedia.org&platform=all-access&agent=user&start=2018-01-18&end=2018-01-18&pages=Bitcoin|Ethereum
//This is a link to the wikipedia page views for both Bitcoin and Ethereum. The data tag is "<td class="table-view--average">70,655</td>" and we would need to seperate out the Bitcoin and Ethereum values.
// If we have time we should expand this for Litecoin
let request = require('request')
var options = {
  url: 'http://tools.wmflabs.org/pageviews/?project=en.wikipedia.org&platform=all-access&agent=user&start=2018-01-18&end=2018-01-18&pages=Bitcoin|Ethereum',
  headers: {
    'User-Agent': 'request'
  }
};

function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body)
  }
}

request(options, callback);

// request('http://tools.wmflabs.org/pageviews/?project=en.wikipedia.org&platform=all-access&agent=user&start=2018-01-18&end=2018-01-18&pages=Bitcoin|Ethereum', function(error, response, body) {
//   if (error) {
//     console.log('error', error)
//   } else {
//     console.log('body : \t' + body)
//   }
// })

// request('http://google.com', function(error, response, body) {
//   if (error) {
//     console.log('error', error)
//   } else {
//     console.log('body : \t' + body)
//   }
// })
