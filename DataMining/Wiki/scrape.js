//http://tools.wmflabs.org/pageviews/?project=en.wikipedia.org&platform=all-access&agent=user&start=2018-01-18&end=2018-01-18&pages=Bitcoin|Ethereum
//This is a link to the wikipedia page views for both Bitcoin and Ethereum. The data tag is "<td class="table-view--average">70,655</td>" and we would need to seperate out the Bitcoin and Ethereum values.
// If we have time we should expand this for Litecoin

// resource :
// https://www.npmjs.com/package/request#custom-http-headers
// https://wikimedia.org/api

let db_insert = require(__dirname + '/../../db/db_functions.js')
let request = require('request') // include request npm package

let date = new Date()

/* this is a comment */
// this works for one line

// format  the date object to a string that fits the request api format
let format_date_request = function(date) {
  let date_string_builder
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

let x = function(pagetitle, date) {

  let startingyear, startingmonth, startingday
  let endingyear, endingmonth, endingday

  // if the date parameter  was  provided... assign all  of the afore-declared variables based on date object parameter
  if (date) {
    date.startingyear ? startingyear = date.startingyear : console.log('no starting year provided')
    date.startingmonth ? startingmonth = date.startingmonth : console.log('no starting month provided')
    date.startingday ? startingday = date.startingday : console.log('no  starting day provided')

    date.endingyear ? endingyear = date.endingyear : console.log('no ending year provided')
    date.endingmonth ? endingyear = date.endingmonth : console.log('no ending month provided')
    date.endingyear ? endingyear = date.endingday : console.log('no ending day provided')
  }
  let date_request_string = format_date_request(date)

  // concatenate request_url string to contain the page  title and the date request string
  let req_url =
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
    if (!error && response.statusCode == 200) {
      let info = JSON.parse(body)
      for (let x = 0; x <  info.items.length; x++) {
        console.log(info.items[x].timestamp + ' : ' + info.items[x].views)

        let insert_object =  {
          'pagetitle' : pagetitle,
          'timestamp' : info.items[x].timestamp.substring(0, info.items[x].timestamp.length -2),
          'year' : info.items[x].timestamp.substring(0,4),
          'month' : info.items[x].timestamp.substring(4,6),
          'day' : info.items[x].timestamp.substring(6,8),
          'views' : info.items[x].views
        }
        db_insert(insert_object, 'wiki_views' /* collection title */)
        // TODO format to unix timestamp, $ date +%s
        // TODO connect to mongo database and write response data to database

      }
    } else {
      console.log(error)
    }
  }
  request(options, callback);
}

// test function call
x('Bitcoin', {
  'startingyear' : date.getFullYear(),
  'startingmonth' : date.getMonth(),
  'startingday' : date.getDate(),
  'endingyear' : date.getFullYear(),
  'endingmonth' : date.getMonth(),
  'endingday' : date.getDate()
})
