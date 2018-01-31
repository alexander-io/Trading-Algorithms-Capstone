//http://tools.wmflabs.org/pageviews/?project=en.wikipedia.org&platform=all-access&agent=user&start=2018-01-18&end=2018-01-18&pages=Bitcoin|Ethereum
//This is a link to the wikipedia page views for both Bitcoin and Ethereum. The data tag is "<td class="table-view--average">70,655</td>" and we would need to seperate out the Bitcoin and Ethereum values.
// If we have time we should expand this for Litecoin

// resource :
// https://www.npmjs.com/package/request#custom-http-headers
// https://wikimedia.org/api

let request = require('request') // include request npm package


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

  if (date) {
    date.startingyear ? startingyear = date.startingyear : console.log('no starting year provided')
    date.startingmonth ? startingmonth = date.startingmonth : console.log('no starting month provided')
    date.startingday ? startingday = date.startingday : console.log('no  starting day provided')

    date.endingyear ? endingyear = date.endingyear : console.log('no ending year provided')
    date.endingmonth ? endingyear = date.endingmonth : console.log('no ending month provided')
    date.endingyear ? endingyear = date.endingday : console.log('no ending day provided')
  }
  let date_request_string = format_date_request(date)

  let req_url =
    'https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/'
    + pagetitle
    + '/daily/'
    + date_request_string

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

        // TODO format to unix timestamp, $ date +%s

      }
    } else {
      console.log(error)
    }
  }
  request(options, callback);
}

x('Bitcoin', {
  'startingyear' : '2017',
  'startingmonth' : '10',
  'startingday' : '1',
  'endingyear' : '2017',
  'endingmonth' : '10',
  'endingday' : '6'
})
