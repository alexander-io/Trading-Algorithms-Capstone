//http://tools.wmflabs.org/pageviews/?project=en.wikipedia.org&platform=all-access&agent=user&start=2018-01-18&end=2018-01-18&pages=Bitcoin|Ethereum
//This is a link to the wikipedia page views for both Bitcoin and Ethereum. The data tag is "<td class="table-view--average">70,655</td>" and we would need to seperate out the Bitcoin and Ethereum values.
// If we have time we should expand this for Litecoin

// resource :
// https://www.npmjs.com/package/request#custom-http-headers
// https://wikimedia.org/api

var funx = require(__dirname + '/../../db/db_functions.js')
var request = require('request') // include request npm package
var date = new Date()

/* this is a comment */
// this works for one line

// format  the date object to a string that fits the request api format
var format_date_request = function(date) {
  var date_string_builder
  if (date.startingmonth < 10) {date.startingmonth = '0' + date.startingmonth}
  if (date.startingday < 10) {date.startingday = '0' + date.startingday}
  if (date.endingmonth < 10) {date.endingmonth = '0' + date.endingmonth}
  if (date.endingday < 10) {date.endingday = '0' + date.endingday}
  return date.startingyear
    + date.startingmonth
    + date.startingday
    + '00/'
    + date.endingyear
    + date.endingmonth
    + date.endingday
    + '00'
}
/*
 * define a function x to fire off request to pageview count rest api
 * provide as parameters :
 * pagetitle, title of the wiki page (case sensitive)
 */

var x = function(pagetitle, date, symbol) {

  var startingyear, startingmonth, startingday
  var endingyear, endingmonth, endingday

  // if the date parameter  was  provided... assign all  of the afore-declared variables based on date object parameter
  if (date) {
    date.startingyear ? startingyear = date.startingyear : console.log('no starting year provided')
    date.startingmonth ? startingmonth = date.startingmonth : console.log('no starting month provided')
    date.startingday ? startingday = date.startingday : console.log('no  starting day provided')

    date.endingyear ? endingyear = date.endingyear : console.log('no ending year provided')
    date.endingmonth ? endingyear = date.endingmonth : console.log('no ending month provided')
    date.endingyear ? endingyear = date.endingday : console.log('no ending day provided')
  }
  var date_request_string = format_date_request(date)

  // concatenate request_url string to contain the page  title and the date request string
  var req_url =
    'https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/'
    + pagetitle
    + '/daily/'
    + date_request_string

  // http request parameters go  here
  var options = {
    url : req_url,
    headers: {
      'User-Agent': 'request'
    }
  };

  function callback(error, response, body) {

    let d = new Date()
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body)
      for (var x = 0; x <  info.items.length; x++) {

        var collection_title = 'wiki_views'
        var insert_object =  {
          'pagetitle' : pagetitle,
          'symbol' : symbol,
          'timestamp' : info.items[x].timestamp.substring(0, info.items[x].timestamp.length -2),
          'year' : info.items[x].timestamp.substring(0,4),
          'month' : info.items[x].timestamp.substring(4,6),
          'day' : info.items[x].timestamp.substring(6,8),
          'views' : info.items[x].views,
          'unix_time' : Date.now(),
          'post_created_time_hour' : d.getHours(),
          'post_created_time_minute' : d.getMinutes()
        }
        console.log('inserting into collection ' + collection_title)
        funx.insert(insert_object, collection_title /* collection title */)
      }
    } else {
      console.log(error)
    }
  }
  request(options, callback);
}

// function call
x('Bitcoin', {
  'startingyear' : date.getFullYear(),
  'startingmonth' : date.getMonth(),
  'startingday' : date.getDate(),
  'endingyear' : date.getFullYear(),
  'endingmonth' : date.getMonth(),
  'endingday' : date.getDate()
}, 'BTC')
x('Ethereum', {
  'startingyear' : date.getFullYear(),
  'startingmonth' : date.getMonth(),
  'startingday' : date.getDate(),
  'endingyear' : date.getFullYear(),
  'endingmonth' : date.getMonth(),
  'endingday' : date.getDate()
}, 'ETH')
x('Bitcoin_Cash', {
  'startingyear' : date.getFullYear(),
  'startingmonth' : date.getMonth(),
  'startingday' : date.getDate(),
  'endingyear' : date.getFullYear(),
  'endingmonth' : date.getMonth(),
  'endingday' : date.getDate()
}, 'BCH')
x('Litecoin', {
  'startingyear' : date.getFullYear(),
  'startingmonth' : date.getMonth(),
  'startingday' : date.getDate(),
  'endingyear' : date.getFullYear(),
  'endingmonth' : date.getMonth(),
  'endingday' : date.getDate()
}, 'LTC')
x('Dogecoin', {
  'startingyear' : date.getFullYear(),
  'startingmonth' : date.getMonth(),
  'startingday' : date.getDate(),
  'endingyear' : date.getFullYear(),
  'endingmonth' : date.getMonth(),
  'endingday' : date.getDate()
}, 'DOGE')
x('Ripple_(payment_protocol)', {
  'startingyear' : date.getFullYear(),
  'startingmonth' : date.getMonth(),
  'startingday' : date.getDate(),
  'endingyear' : date.getFullYear(),
  'endingmonth' : date.getMonth(),
  'endingday' : date.getDate()
}, 'XRP')

x('EOS.IO', {
  'startingyear' : date.getFullYear(),
  'startingmonth' : date.getMonth(),
  'startingday' : date.getDate(),
  'endingyear' : date.getFullYear(),
  'endingmonth' : date.getMonth(),
  'endingday' : date.getDate()
}, 'EOS')

x('Cardano_(platform)', {
  'startingyear' : date.getFullYear(),
  'startingmonth' : date.getMonth(),
  'startingday' : date.getDate(),
  'endingyear' : date.getFullYear(),
  'endingmonth' : date.getMonth(),
  'endingday' : date.getDate()
}, 'ADA')

x('Stellar_(payment_network)', {
  'startingyear' : date.getFullYear(),
  'startingmonth' : date.getMonth(),
  'startingday' : date.getDate(),
  'endingyear' : date.getFullYear(),
  'endingmonth' : date.getMonth(),
  'endingday' : date.getDate()
}, 'XLM')

x('NEO_(cryptocurrency)', {
  'startingyear' : date.getFullYear(),
  'startingmonth' : date.getMonth(),
  'startingday' : date.getDate(),
  'endingyear' : date.getFullYear(),
  'endingmonth' : date.getMonth(),
  'endingday' : date.getDate()
}, 'NEO')

x('IOTA_(cryptocurrency)', {
  'startingyear' : date.getFullYear(),
  'startingmonth' : date.getMonth(),
  'startingday' : date.getDate(),
  'endingyear' : date.getFullYear(),
  'endingmonth' : date.getMonth(),
  'endingday' : date.getDate()
}, 'MIOTA')
